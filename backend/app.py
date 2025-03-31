from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import google.generativeai as genai
import os
import jwt
import json
import re
import math
from pymongo import MongoClient
from bson import ObjectId
from pydantic_core.core_schema import CoreSchema, str_schema
from pydantic.json_schema import JsonSchemaValue
from pydantic import GetCoreSchemaHandler
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")

# Environment Variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "mentor_secret_123") 
STUDENTS_FILE = "student_resources.json"

genai.configure(api_key=GEMINI_API_KEY)

client = MongoClient(MONGO_URI)
db = client["test"]  
students_collection = db["test"]
chat_collection = db["chat"]

app = FastAPI()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://logikxmind.com/chat"],
#     allow_origins=["https://logikxmind.com/chat"], 
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# --------------------------- UTILS ---------------------------

class PyObjectId(str):
    """Custom Pydantic class to handle MongoDB's ObjectId."""

    @classmethod
    def __get_pydantic_core_schema__(cls, *args, **kwargs) -> CoreSchema:
        return str_schema()

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema: CoreSchema, handler: GetCoreSchemaHandler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema

    @classmethod
    def validate(cls, v, info):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")

# --------------------------- MODELS ---------------------------

class ChatRequest(BaseModel):
    unique_id: str
    message: str

class UserResponse(BaseModel):
    unique_id: str
    response: dict
    requires_action: bool

class Student(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: Optional[str] = None
    grade: Optional[int] = None
    major: Optional[str] = None
    interests: Optional[List[str]] = None
    goals: Optional[List[str]] = None

    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

class AdminLogin(BaseModel):
    username: str
    password: str

# --------------------------- AI SERVICE ---------------------------

class MentorService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.system_prompt = """
        You are a student mentor AI, providing personalized guidance and support to students.

        **Handling General Queries:**
        - If the student asks general questions about study tips, career advice, or resources, provide helpful information.
        - Do NOT ask for sensitive personal information beyond what is necessary for mentoring.
        - Example general questions:
          - "How can I improve my study habits?"
          - "What career paths are available in computer science?"

        **Handling Student-Specific Queries:**
        - If the student asks about specific academic or career goals, analyze their profile (grade, major, interests, goals).
        - If any relevant details are missing, ask for them before providing targeted advice.
        - Focus on providing actionable advice and relevant resources.

        **Format your response in strict JSON format:**
        ```json
        {
            "response": "Provide a clear answer based on the student's query.",
            "next_question": "Ask for missing details only if required.",
            "requires_info": ["grade", "major", "interests", "goals"],
            "resources": ["Resource Name 1", "Resource Name 2"]
        }
        ```
        """

    def load_resources(self):
        try:
            with open(STUDENTS_FILE, "r") as file:
                return json.load(file).get("resources", [])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading student resources: {str(e)}")

    def determine_query_type(self, message):
        general_keywords = ["study tips", "career advice", "resources", "general help"]
        return any(keyword in message.lower() for keyword in general_keywords)

    def generate_response(self, student_data: dict, chat_history: list, message: str):
        try:
            resources_data = self.load_resources()
            llm_prompt = [
                self.system_prompt,
                f"Student Profile: {json.dumps(self.convert_objectid(student_data), indent=2)}",
                f"Available Resources: {json.dumps(self.convert_objectid(resources_data), indent=2)}",
                f"Conversation History: {json.dumps(self.convert_objectid(chat_history), indent=2)}",
                f"Student's latest query: {message}"
            ]

            response = self.model.generate_content(llm_prompt)

            if not response or not response.candidates:
                raise ValueError("Empty response from Gemini API")

            raw_text = response.candidates[0].content.parts[0].text

            json_match = re.search(r"```json\n(.*?)\n```", raw_text, re.DOTALL)

            if json_match:
                cleaned_json = json_match.group(1)
            else:
                raise ValueError("No valid JSON found in AI response")

            return json.loads(cleaned_json)

        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"AI Response Error: Invalid JSON - {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini API Failure: {str(e)}")

    def convert_objectid(self, data):
        if isinstance(data, list):
            return [self.convert_objectid(item) for item in data]
        elif isinstance(data, dict):
            return {key: self.convert_objectid(value) for key, value in data.items()}
        elif isinstance(data, ObjectId):
            return str(data)
        elif isinstance(data, datetime):
            return data.isoformat()
        elif isinstance(data, float) and math.isnan(data):
            return None
        elif isinstance(data, str) and data.lower() == "nan":
            return None
        return data

# --------------------------- CORE ENDPOINTS ---------------------------

@app.post("/chat", response_model=UserResponse)
async def chat_assist(request: ChatRequest):
    student = students_collection.find_one({"_id": ObjectId(request.unique_id) if ObjectId.is_valid(request.unique_id) else None})

    if student:
        student = {**student, "_id": str(student["_id"])}
        student = Student.model_validate(student)

    if not student:
        student = Student()
        students_collection.insert_one(student.model_dump(by_alias=True))
    

    chat_entry = {
        "student_id": student.id,
        "message": request.message,
        "timestamp": datetime.now()
    }
    chat_collection.insert_one(chat_entry)

    history = list(chat_collection.find(
        {"student_id": student.id},
        {"_id": 0, "message": 1, "timestamp": 1}
    ).sort("timestamp", -1).limit(10))

    mentor_service = MentorService()
    response = mentor_service.generate_response(
        student.model_dump(by_alias=True), history, request.message)

    chat_collection.insert_one({
        "student_id": student.id,
        "message": response,
        "is_bot": True,
        "timestamp": datetime.now()
    })

    return {
        "unique_id": str(student.id),
        "response": response,
        "requires_action": bool(response.get('requires_info'))
    }
                   
if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')