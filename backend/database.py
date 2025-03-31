from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_student_profile(student_id):
    data = client.table('students').select('*').eq('id', student_id).single().execute()
    return data.data

def get_college_syllabus(university, course):
    data = client.table('college_syllabus').select('*').eq('university', university).eq('course', course).execute()
    return data.data

def get_company_requirements(companies, domain):
    data = client.table('company').select('*').in_('company_name', companies).eq('domain', domain).execute()
    return data.data
