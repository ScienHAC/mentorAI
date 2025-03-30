"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import VerticalNav from "./VerticalNav"
import ProfileSection from "./ProfileSection"
import RoadmapViewer from "./RoadmapViewer"
import SkillsMatrix from "./SkillsMatrix"
import Achievements from "./Achievements"
import InterviewPrep from "./InterviewPrep"
import Settings from "./Settings"
import ThemeToggle from "./ThemeToggle"
import LicensesCertifications from "./licenses-certifications"
import ExperienceTab from "./experience"
import EducationTab from "./education"
import ProjectsTab from "./projects"
import type * as Icons from "lucide-react"

type Tab = {
  id: string
  label: string
  icon: keyof typeof Icons
}

const tabs: Tab[] = [
  { id: "profile", label: "Profile", icon: "User" },
  { id: "experience", label: "Experience", icon: "Briefcase" },
  { id: "education", label: "Education", icon: "GraduationCap" },
  { id: "licenses", label: "Licenses & Certifications", icon: "Award" },
  { id: "projects", label: "Projects", icon: "FolderGit2" },
  { id: "roadmap", label: "Roadmap", icon: "Map" },
  { id: "skills", label: "Skills Matrix", icon: "BarChart2" },
  { id: "achievements", label: "Achievements", icon: "Trophy" },
  { id: "interview", label: "Interview Prep", icon: "MessageSquare" },
  { id: "settings", label: "Settings", icon: "Settings" },
]

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("profile")

  // Read active tab from URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabFromUrl = urlParams.get("tab")

    if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    } else {
      // If no tab is present in the URL, set default tab
      router.replace(`?tab=profile`, { scroll: false })
    }
  }, [router])

  // Update the URL when the tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    router.push(`?tab=${newTab}`, { scroll: false }) // Update URL without reloading
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />
      case "experience":
        return <ExperienceTab />
      case "education":
        return <EducationTab />
      case "licenses":
        return <LicensesCertifications />
      case "projects":
        return <ProjectsTab />
      case "roadmap":
        return <RoadmapViewer />
      case "skills":
        return <SkillsMatrix />
      case "achievements":
        return <Achievements />
      case "interview":
        return <InterviewPrep />
      case "settings":
        return <Settings />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Sidebar Navigation */}
      <VerticalNav tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="bg-muted py-6 mt-16">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            © 2025 logikxmind. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}
