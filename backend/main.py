from crew import mentor_ai_crew
from database import get_student_profile, get_college_syllabus, get_company_requirements
import json

from dotenv import load_dotenv

load_dotenv()

def run(student_id, domain, companies, total_semesters):
    # student_profile = get_student_profile(student_id)
    student_profile = {"id":"994ba0ff-3f08-4076-8a6e-2ed4910e2b07","full_name":"Naman","university":"K.R. Mangalam University ","year_of_joining":"2022","course":"btech-cse-core","certifications":[{"id":"da3ccffc-ad53-480e-8fe3-8dbc4555de8d","user_id":"994ba0ff-3f08-4076-8a6e-2ed4910e2b07","name":"samsung solve for tommorow","issuer":"samsung","issue_date":"2024-09-01","expiration_date":None,"credential_id":"5"}],"education":[{"id":"1484dc16-d5f9-4d71-9556-07665c47210b","user_id":"994ba0ff-3f08-4076-8a6e-2ed4910e2b07","institution_name":"K.R. Mangalam University ","degree":"BTECH CSE","location":"Gurgaon","start_date":"2022-08-01","end_date":"2025-08-01","grade":"8.2","field_of_study":"Computer Science"}],"experiences":[{"id":"72f8ea1e-09fb-47bd-92cf-69b5d4dc435c","user_id":"994ba0ff-3f08-4076-8a6e-2ed4910e2b07","role_title":"software engineer","company_name":"tradebox pvt limited","start_date":"2024-08-01","end_date":"2024-10-01","description":"Ui design and testing"}],"projects":[{"id":"c5744293-f413-4620-ba42-76b1100fd190","user_id":"994ba0ff-3f08-4076-8a6e-2ed4910e2b07","title":"btrack","subtitle":"Web Application","start_date":"2017-02-01","end_date":None,"description":"good","tags":["js","nextjs"]}]}
    # syllabus = get_college_syllabus(student_profile['university'], student_profile['course'])
    syllabus = {
    "B.Tech(Core)": {
        "Semester I": {
            "Technical Subjects": [
                "Programming for Problem Solving (with Python)",
                "Computational Tools and Career Foundations"
            ],
            "Certifications": [
                "IBM Data Analysis with Python Certification Course"
            ],
            "Projects": [
                None    
            ]
        },
        "Semester II": {
            "Technical Subjects": [
                "Object Oriented Programming using C++"
            ],
            "Certifications": [
                "IBM Software Foundation Course C++ Certification Course"
            ],
            "Projects": [
                "Minor Project-I"
            ]
        },
        "Semester III": {
            "Technical Subjects": [
                "Nand to Tetris",
                "Data Structures Using C++",
                "Object Oriented Programming with Java",
                "Competetive Coding - I"
            ],
            "Certifications": [
                "Pearrson IT Specialist (Track: Java)"
            ],
            "Projects": [
                "Summer Internship-I"
            ]
        },
        "Semester IV": {
            "Technical Subjects": [
                "Operating Systems",
                "Competetive Coding - II"
            ],
            "Certifications": [
                None
            ],
            "Projects": [
                "Minor Project-II"
            ]
        },
        "Semester V": {
            "Technical Subjects": [
                "Theory of Computation",
                "Analysis and Design of Algorithms",
                "Introduction to Database Management Systems",
                "Arithmetic and Reasoning Skills",
                "Competitive Coding - III"
            ],
            "Certifications": [
                None
            ],
            "Projects": [
                "Summer Internship-II"
            ]
        },
        "Semester VI": {
            "Technical Subjects": [
                "Microprocessors and Computer Architecture",
                "Computer Networks",
                "Competitive Coding - IV"
            ],
            "Certifications": [
                "MOOC (Swayam/ NPTEL/AICTE’s ELIS )"
            ],
            "Projects": [
                "Minor Project-III"
            ]
        }
    }
}
    company_reqs = get_company_requirements(companies, domain)

    inputs = {
        "student_profile": student_profile,
        "college_syllabus": syllabus,
        "company_requirements": company_reqs,
        "total_semesters": total_semesters
    }

    result = mentor_ai_crew.kickoff(inputs=inputs)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    run(
        student_id="994ba0ff-3f08-4076-8a6e-2ed4910e2b07",
        domain="fsd",
        companies=["Google", "Microsoft", "TCS", "Infosys"],
        total_semesters=8
    )
