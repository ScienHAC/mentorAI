import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ResumeHeader from "@/components/resume/ResumeHeader"
import ResumeExperience from "@/components/resume/ResumeExperience"
import ResumeEducation from "@/components/resume/ResumeEducation"
import ResumeLicenses from "@/components/resume/ResumeLicenses"
import ResumeProjects from "@/components/resume/ResumeProjects"
import ResumeSkills from "@/components/resume/ResumeSkills"
import { Space_Mono } from "next/font/google"
import Link from "next/link"
import { createServerSupabaseClient } from "@/utils/supabase-server"

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] })

type Props = {
    params: { username: string }
}


// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;
    const { username } = resolvedParams;

    // Fetch user data
    const { data: user } = await supabase.from("profiles").select("full_name").eq("username", username).single();

    if (!user) {
        return {
            title: "User not found",
        };
    }

    return {
        title: `${user.full_name} | Resume`,
        description: `View ${user.full_name}'s professional resume and portfolio`,
    };
}

export default async function ResumePage({ params }: Props) {
    const supabase = await createServerSupabaseClient()
    const resolvedParams = await params;
    const { username } = resolvedParams;

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single()

    if (profileError || !profile) {
        notFound()
    }

    // Fetch user's experiences
    const { data: experiences } = await supabase
        .from("experiences")
        .select("*")
        .eq("user_id", profile.id)
        .order("start_date", { ascending: false })

    // Fetch user's education
    const { data: education } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", profile.id)
        .order("start_date", { ascending: false })

    // Fetch user's licenses & certifications
    const { data: licenses } = await supabase
        .from("licenses_certifications")
        .select("*")
        .eq("user_id", profile.id)
        .order("issue_date", { ascending: false })

    // Fetch user's projects
    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", profile.id)
        .order("start_date", { ascending: false })

    // Fetch user's skills
    const { data: skills } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", profile.id)
        .order("level", { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 md:py-6 flex items-center">
                    <Link href="/" className={`text-xl md:text-2xl font-bold lowercase ${spaceMono.className} mr-auto`}>
                        logikxmind
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/connect/${username}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Connect
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8 print:space-y-6">
                    <ResumeHeader profile={profile} />

                    {experiences && experiences.length > 0 && <ResumeExperience experiences={experiences} />}

                    {education && education.length > 0 && <ResumeEducation education={education} />}

                    {licenses && licenses.length > 0 && <ResumeLicenses licenses={licenses} />}

                    {projects && projects.length > 0 && <ResumeProjects projects={projects} />}

                    {skills && skills.length > 0 && <ResumeSkills skills={skills} />}
                </div>
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
                <div className="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    © 2025 logikxmind. All rights reserved.
                </div>
            </footer>
        </div>
    )
}