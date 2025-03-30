// app/api/fetch-all/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    // 1) Fetch data from multiple tables concurrently
    const [
      certificationsRes,
      educationRes,
      experiencesRes,
      profilesRes,
      projectsRes,
    ] = await Promise.all([
      supabase
        .from('certifications')
        .select('id, user_id, name, issuer, issue_date, expiration_date, credential_id'),
      supabase
        .from('education')
        .select('id, user_id, institution_name, degree, location, start_date, end_date, grade, field_of_study'),
      supabase
        .from('experiences')
        .select('id, user_id, role_title, company_name, start_date, end_date, description'),
      supabase
        .from('profiles')
        .select('id, full_name, university, year_of_joining, course'),
      supabase
        .from('projects')
        .select('id, user_id, title, subtitle, start_date, end_date, description, tags'),
    ])

    // 2) Check for errors in each query
    if (
      certificationsRes.error ||
      educationRes.error ||
      experiencesRes.error ||
      profilesRes.error ||
      projectsRes.error
    ) {
      return NextResponse.json(
        {
          error:
            certificationsRes.error?.message ||
            educationRes.error?.message ||
            experiencesRes.error?.message ||
            profilesRes.error?.message ||
            projectsRes.error?.message,
        },
        { status: 500 }
      )
    }

    // 3) Extract the data arrays (fallback to empty array if null)
    const certifications = certificationsRes.data ?? []
    const education = educationRes.data ?? []
    const experiences = experiencesRes.data ?? []
    const profiles = profilesRes.data ?? []
    const projects = projectsRes.data ?? []

    // 4) Nest each user’s data inside their profile object
    const nestedData = profiles.map((profile) => {
      return {
        ...profile,
        certifications: certifications.filter((item) => item.user_id === profile.id),
        education: education.filter((item) => item.user_id === profile.id),
        experiences: experiences.filter((item) => item.user_id === profile.id),
        projects: projects.filter((item) => item.user_id === profile.id),
      }
    })

    // 5) Return the nested result
    return NextResponse.json(nestedData, { status: 200 })
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
