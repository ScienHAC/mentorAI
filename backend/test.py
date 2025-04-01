# from openai import OpenAI

# API_KEY = "ddc-id2KaVv0rynIolWbSO5m6CjtYx5H5RUrzCL82yEuqNDAWtfWQh"
# BASE_URL = "https://beta.sree.shop/v1"

# client = OpenAI(
#     api_key="ddc-id2KaVv0rynIolWbSO5m6CjtYx5H5RUrzCL82yEuqNDAWtfWQh",
#     base_url=BASE_URL
# )

# print("Testing Provider-5/gpt-4o")
# print("*"*50)
# completion = client.chat.completions.create(
#   model="Provider-5/gpt-4o",
#   messages=[
#     {"role": "developer", "content": "You are a helpful assistant."},
#     {"role": "user", "content": "Hello!"}
#   ],
#   stream=False
# )
# print(completion)

# print("\n\nTesting Provider-5/gpt-4o")
# print("*"*50)

# completion = client.chat.completions.create(
#     model="Provider-5/gpt-4o",
#     messages=[
#         {"role": "system", "content": "You are a helpful assistant."},
#         {"role": "user", "content": "Write 10 lines about India ??"}
#     ],
#     stream=True
# )

# for chunk in completion:
#     print(chunk)


# from supabase import create_client
# import os
# from dotenv import load_dotenv

# load_dotenv()


# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# client = create_client(SUPABASE_URL, SUPABASE_KEY)

# data = client.table('company').select('*').in_('company_name', ["Google"]).eq('domain', "Software Development").execute()
# print(data)

from crewai import Agent, Crew, Task, Process, LLM
import yaml

from dotenv import load_dotenv

load_dotenv()

with open('config/agents.yaml') as f:
    agents_cfg = yaml.safe_load(f)

with open('config/tasks.yaml') as f:
    tasks_cfg = yaml.safe_load(f)

gemini_llm = LLM(
                model="gemini/gemini-1.5-pro-latest",
                temperature=0.7
            )

