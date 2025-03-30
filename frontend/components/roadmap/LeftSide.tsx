"use client"
import React from "react"
import ProgressTracker from "./ProgressTracker"

// Define your RoadmapNode type (adjust or import it if defined elsewhere)
export type RoadmapNode = {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "locked"
  category: "fundamentals" | "advanced" | "specialization"
  skills: string[]
  resources: {
    type: "video" | "article" | "project"
    title: string
    url: string
    duration?: string
    difficulty?: "beginner" | "intermediate" | "advanced"
  }[]
  deadline?: Date
  prerequisites: string[]
  nextSteps: string[]
  companyRelevance: string[]
}

interface LeftSidebarProps {
  leftSidebarOpen: boolean
  setLeftSidebarOpen: (open: boolean) => void
  sidebarWidth: string | number
  sampleData: RoadmapNode[]
}

const LeftSide: React.FC<LeftSidebarProps> = ({
  sampleData,
}) => {
  return (
    <>
      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        <ProgressTracker nodes={sampleData} />
        {/*
          If you want to include the Timeline component, you can uncomment the code below:
          <div className="mt-6">
            <Timeline nodes={sampleData} selectedNode={selectedNode} onNodeSelect={setSelectedNode} />
          </div>
        */}
      </div>
    </>
  )
}

export default LeftSide
