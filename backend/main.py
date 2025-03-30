import sys
from crew import CareerDevelopmentCrew

import os
from dotenv import load_dotenv
load_dotenv()

def run():
    inputs = {
        'user_data': {
            'id': '123',
            'email': 'test.user@example.com',
            'skills': ['Python', 'Data Analysis'],
            'certifications': ['AWS Certified'],
            'career_goals': {
                'target_roles': ['Data Scientist'],
                'dream_companies': ['Google']
            },
            'education': [
                {'institution': 'Tech University', 'degree': 'BSc Computer Science', 'year': 2023}
            ],
            'experience': [
                {'company': 'Startup Inc.', 'role': 'Intern', 'duration': '6 months'}
            ],
            'progress': {'roadmap_completion': 50}
        }
    }
    
    print(inputs)
    # CareerDevelopmentCrew().crew().kickoff(inputs=inputs)

if __name__ == "__main__":
    run()
