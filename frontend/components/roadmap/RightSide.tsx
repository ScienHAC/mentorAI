"use client"
import React from "react"
import { Calendar } from "@/components/ui/calendar"
import ResourcePanel from "./ResourcePanel"
import { RoadmapNode } from "./RoadmapComponent"

interface RightSidebarProps {
  rightSidebarOpen: boolean
  setRightSidebarOpen: (open: boolean) => void
  sidebarWidth: string | number
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  sampleData: RoadmapNode[]// Replace 'any[]' with your RoadmapNode[] type if available
  selectedNode: string | null
}

const RightSide: React.FC<RightSidebarProps> = ({
  selectedDate,
  setSelectedDate,
  sampleData,
  selectedNode,
}) => {
  return (
    <>
      <div className="p-4 overflow-y-auto h-[calc(100%-60px)] ">
      <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  className="rounded-md border shadow-sm"
  classNames={{
    day_selected: "bg-primary text-primary-foreground hover:bg-primary/90" 
  }}
/>
        <div className="mt-6">
          <ResourcePanel nodes={sampleData} selectedNode={selectedNode} />
        </div>
      </div>
      </>
   
  )
}

export default RightSide
