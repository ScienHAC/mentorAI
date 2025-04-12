"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, BookOpen, Briefcase, Download, Share2, Video, FileText, Book } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Company } from "@/types"

interface RoadmapViewProps {
  selectedCompanyIds: string[]
  companies: Company[]
}

interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  resources: {
    title: string
    url: string
    type: "video" | "article" | "course" | "book"
  }[]
}

export default function RoadmapView({ selectedCompanyIds, companies }: RoadmapViewProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("roadmap")
  const [roadmapLoading, setRoadmapLoading] = useState(true)
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    const generateRoadmap = async () => {
      setRoadmapLoading(true)

      // In a real app, this would be an API call to generate a roadmap
      // For now, we'll simulate a delay and create a mock roadmap
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create milestones based on selected companies
      const generatedMilestones: Milestone[] = [
        {
          id: "1",
          title: "Master Core Programming Concepts",
          description: "Build a strong foundation in programming fundamentals required by the selected companies.",
          completed: false,
          resources: [
            {
              title: "Data Structures and Algorithms",
              url: "https://example.com/dsa",
              type: "course",
            },
            {
              title: "Object-Oriented Programming",
              url: "https://example.com/oop",
              type: "book",
            },
          ],
        },
        {
          id: "2",
          title: "Develop Technical Skills",
          description: `Focus on the specific technical skills required by ${companies.map((c) => c.company_name).join(", ")}.`,
          completed: false,
          resources: [
            {
              title: "System Design Fundamentals",
              url: "https://example.com/system-design",
              type: "video",
            },
            {
              title: "Advanced Problem Solving",
              url: "https://example.com/problem-solving",
              type: "article",
            },
          ],
        },
        {
          id: "3",
          title: "Build Projects",
          description: "Create portfolio projects that showcase your skills relevant to the target positions.",
          completed: false,
          resources: [
            {
              title: "Project Ideas for Software Engineers",
              url: "https://example.com/project-ideas",
              type: "article",
            },
            {
              title: "Building a Full-Stack Application",
              url: "https://example.com/fullstack",
              type: "course",
            },
          ],
        },
        {
          id: "4",
          title: "Interview Preparation",
          description: "Prepare for technical interviews at your target companies.",
          completed: false,
          resources: [
            {
              title: "Mock Interview Practice",
              url: "https://example.com/mock-interviews",
              type: "course",
            },
            {
              title: "Company-Specific Interview Questions",
              url: "https://example.com/interview-questions",
              type: "article",
            },
          ],
        },
        {
          id: "5",
          title: "Apply and Network",
          description: "Apply to positions and build your professional network.",
          completed: false,
          resources: [
            {
              title: "Resume Building Workshop",
              url: "https://example.com/resume",
              type: "video",
            },
            {
              title: "Networking Strategies for Tech Professionals",
              url: "https://example.com/networking",
              type: "book",
            },
          ],
        },
      ]

      setMilestones(generatedMilestones)
      setRoadmapLoading(false)
    }

    if (selectedCompanyIds.length > 0) {
      generateRoadmap()
    }
  }, [selectedCompanyIds, companies])

  const toggleMilestoneCompletion = (id: string) => {
    setMilestones((prev) =>
      prev.map((milestone) => (milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone)),
    )
  }

  const downloadRoadmap = () => {
    toast({
      title: "Roadmap downloaded",
      description: "Your roadmap has been downloaded as a PDF",
    })
  }

  const shareRoadmap = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied to clipboard",
      description: "Share this link with others to show your roadmap",
    })
  }

  if (selectedCompanyIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Briefcase className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No companies selected</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
          Select at least one company from the browse tab to generate a personalized roadmap
        </p>
        <Button onClick={() => setActiveTab("browse")}>Browse Companies</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your Career Roadmap</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Based on {companies.length} selected {companies.length === 1 ? "company" : "companies"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadRoadmap}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={shareRoadmap}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="roadmap" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="companies">Selected Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-6">
          {roadmapLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[28px] top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex gap-6">
                      <div className="relative z-10">
                        <button
                          onClick={() => toggleMilestoneCompletion(milestone.id)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${milestone.completed
                              ? "bg-green-100 dark:bg-green-900/30 text-green-500"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                        >
                          {milestone.completed ? <CheckCircle className="h-8 w-8" /> : <Circle className="h-8 w-8" />}
                        </button>
                      </div>

                      <Card
                        className={`flex-1 transition-colors ${milestone.completed
                            ? "border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10"
                            : ""
                          }`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl flex items-center">
                            <span>
                              Step {index + 1}: {milestone.title}
                            </span>
                            {milestone.completed && (
                              <Badge className="ml-2 bg-green-500 hover:bg-green-600">Completed</Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-slate-600 dark:text-slate-300">{milestone.description}</p>

                          <div>
                            <h4 className="font-medium mb-2">Resources</h4>
                            <div className="space-y-2">
                              {milestone.resources.map((resource, i) => (
                                <a
                                  key={i}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                  {resource.type === "video" && (
                                    <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                                      <Video className="h-3.5 w-3.5 text-red-500" />
                                    </div>
                                  )}
                                  {resource.type === "article" && (
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                                    </div>
                                  )}
                                  {resource.type === "course" && (
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                                      <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                                    </div>
                                  )}
                                  {resource.type === "book" && (
                                    <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full">
                                      <Book className="h-3.5 w-3.5 text-amber-500" />
                                    </div>
                                  )}
                                  <span>{resource.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>

                          {!milestone.completed && (
                            <Button onClick={() => toggleMilestoneCompletion(milestone.id)} className="w-full mt-2">
                              Mark as Complete
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="companies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id}>
                <CardHeader>
                  <CardTitle>{company.company_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Position</h3>
                    <p className="text-slate-600 dark:text-slate-300">{company.position}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Domain</h3>
                    <Badge variant="outline">{company.domain}</Badge>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Compensation</h3>
                    <p className="text-slate-600 dark:text-slate-300">₹{company.ug_compensation} LPA (UG)</p>
                    {company.pg_compensation > 0 && (
                      <p className="text-slate-600 dark:text-slate-300">₹{company.pg_compensation} LPA (PG)</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Required Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(company.coding_languages).map(([lang, level]) => (
                        <Badge key={lang} variant="secondary">
                          {lang}: {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
