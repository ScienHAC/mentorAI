"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Sparkles, BookOpen} from "lucide-react"
import {
  CheckCircle,
  Lock,
  Zap,
  CalendarIcon,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import LeftSide from "./LeftSide"
import RightSide from "./RightSide"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

const sampleData: RoadmapNode[] = [
  {
    id: "1",
    title: "HTML & CSS Fundamentals",
    description: "Learn the building blocks of web design and styling",
    status: "completed",
    category: "fundamentals",
    skills: ["HTML5", "CSS3", "Responsive Design"],
    resources: [
      {
        type: "video",
        title: "HTML & CSS Crash Course",
        url: "https://example.com/html-css",
        duration: "2h 15m",
        difficulty: "beginner",
      },
      {
        type: "article",
        title: "CSS Grid Layout Guide",
        url: "https://example.com/css-grid",
        difficulty: "beginner",
      },
      {
        type: "project",
        title: "Build a Portfolio Website",
        url: "https://example.com/portfolio-project",
        difficulty: "beginner",
      },
    ],
    prerequisites: [],
    nextSteps: ["2"],
    companyRelevance: ["Google", "Microsoft", "Meta"],
  },
  {
    id: "2",
    title: "JavaScript Essentials",
    description: "Master the language that powers interactive web experiences",
    status: "in-progress",
    category: "fundamentals",
    skills: ["JavaScript", "ES6+", "DOM Manipulation"],
    resources: [
      {
        type: "video",
        title: "JavaScript Fundamentals",
        url: "https://example.com/js-fundamentals",
        duration: "3h 45m",
        difficulty: "beginner",
      },
      {
        type: "article",
        title: "Understanding Async/Await",
        url: "https://example.com/async-await",
        difficulty: "intermediate",
      },
      {
        type: "project",
        title: "Build an Interactive Quiz App",
        url: "https://example.com/quiz-app",
        difficulty: "intermediate",
      },
    ],
    prerequisites: ["1"],
    nextSteps: ["3", "4"],
    companyRelevance: ["Google", "Meta", "Amazon"],
  },
  {
    id: "3",
    title: "React Fundamentals",
    description: "Build powerful user interfaces with components",
    status: "locked",
    category: "advanced",
    skills: ["React", "JSX", "Hooks", "State Management"],
    resources: [
      {
        type: "video",
        title: "React for Beginners",
        url: "https://example.com/react-beginners",
        duration: "4h 30m",
        difficulty: "intermediate",
      },
      {
        type: "article",
        title: "Understanding React Hooks",
        url: "https://example.com/react-hooks",
        difficulty: "intermediate",
      },
      {
        type: "project",
        title: "Build a Todo App with React",
        url: "https://example.com/react-todo",
        difficulty: "intermediate",
      },
    ],
    prerequisites: ["2"],
    nextSteps: ["5"],
    companyRelevance: ["Meta", "Netflix", "Airbnb"],
  },
  {
    id: "4",
    title: "Node.js Backend",
    description: "Create server-side applications with JavaScript",
    status: "locked",
    category: "advanced",
    skills: ["Node.js", "Express", "REST APIs"],
    resources: [
      {
        type: "video",
        title: "Node.js Crash Course",
        url: "https://example.com/nodejs-crash",
        duration: "3h 15m",
        difficulty: "intermediate",
      },
      {
        type: "article",
        title: "Building RESTful APIs with Express",
        url: "https://example.com/express-rest",
        difficulty: "intermediate",
      },
      {
        type: "project",
        title: "Create a Blog API",
        url: "https://example.com/blog-api",
        difficulty: "advanced",
      },
    ],
    prerequisites: ["2"],
    nextSteps: ["5"],
    companyRelevance: ["Shopify", "PayPal", "LinkedIn"],
  },
  {
    id: "5",
    title: "Full Stack Development",
    description: "Combine frontend and backend skills for complete applications",
    status: "locked",
    category: "specialization",
    skills: ["MERN Stack", "Authentication", "Deployment"],
    resources: [
      {
        type: "video",
        title: "Full Stack MERN Application",
        url: "https://example.com/mern-stack",
        duration: "6h 45m",
        difficulty: "advanced",
      },
      {
        type: "article",
        title: "Authentication with JWT",
        url: "https://example.com/jwt-auth",
        difficulty: "advanced",
      },
      {
        type: "project",
        title: "Build an E-commerce Platform",
        url: "https://example.com/ecommerce",
        difficulty: "advanced",
      },
    ],
    prerequisites: ["3", "4"],
    nextSteps: [],
    companyRelevance: ["Amazon", "Shopify", "Stripe"],
  },
]

const RoadmapComponent: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false) // Default closed on mobile
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false) // Default closed on mobile
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [hasMounted, setHasMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)

  const mainRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowSize({ width, height })
      setIsMobile(width < 768)
      
      // Auto-close sidebars on mobile when screen resizes to mobile size
      if (width < 768) {
        setLeftSidebarOpen(false)
        setRightSidebarOpen(false)
      } else {
        // Default to open on desktop
        setLeftSidebarOpen(true)
        setRightSidebarOpen(true)
      }
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => setHasMounted(true), [])

  // Handle closing sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile) {
        if (leftSidebarOpen && !document.getElementById('left-sidebar')?.contains(e.target as Node)) {
          setLeftSidebarOpen(false)
        }
        if (rightSidebarOpen && !document.getElementById('right-sidebar')?.contains(e.target as Node)) {
          setRightSidebarOpen(false)
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [leftSidebarOpen, rightSidebarOpen, isMobile])

  const sidebarWidth = "320px"
  const getMainContentWidth = () => {
    if (windowSize.width < 768) return "100%"
    let width = windowSize.width
    if (leftSidebarOpen) width -= 320
    if (rightSidebarOpen) width -= 320
    return `${width}px`
  }



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Zap className="w-5 h-5 text-blue-500" />
      case "locked":
        return <Lock className="w-5 h-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-green-500/20 to-green-500/5"
      case "in-progress":
        return "from-blue-500/20 to-blue-500/5"
      case "locked":
        return "from-gray-500/20 to-gray-500/5"
      default:
        return ""
    }
  }

  if (!hasMounted) return null

  return (
    <div
      className="relative min-h-screen bg-background text-foreground overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className="fixed inset-0 bg-gradient-to-br from-background to-background/80 z-0"
        style={{
          backgroundPosition: `${(mousePosition.x / windowSize.width) * 100}% ${
            (mousePosition.y / windowSize.height) * 100
          }%`,
        }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl"
          animate={{ x: [0, -70, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          style={{ top: "50%", right: "10%" }}
        />
      </div>
      
      {/* Left Sidebar */}
      <div
        id="left-sidebar"
        className={cn(
          "fixed top-0 left-0 h-full bg-background/95 backdrop-blur-sm border-r border-border z-40 transition-all duration-300 ease-in-out",
          leftSidebarOpen 
            ? "translate-x-0" 
            : "-translate-x-full",
          isMobile 
            ? "w-full max-w-sm shadow-lg" 
            : `w-[${sidebarWidth}]`
        )}
        style={{ width: isMobile ? "85%" : sidebarWidth }}
      >
        <div className="sticky top-0 p-4 bg-background/80 backdrop-blur-md z-10 flex justify-between items-center border-b border-border/50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Learning Path
        </h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setLeftSidebarOpen(false)}>
              <X className="w-5 h-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        <div className="p-4">
          <LeftSide
            leftSidebarOpen={leftSidebarOpen}
            setLeftSidebarOpen={setLeftSidebarOpen}
            sidebarWidth={sidebarWidth}
            sampleData={sampleData}
          />
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div
        id="right-sidebar"
        className={cn(
          "fixed top-0 right-0 h-full bg-background/95 backdrop-blur-sm border-l border-border z-40 transition-all duration-300 ease-in-out overflow-y-auto",
          rightSidebarOpen 
            ? "translate-x-0" 
            : "translate-x-full",
          isMobile 
            ? "w-full max-w-sm shadow-lg" 
            : `w-[${sidebarWidth}]`
        )}
        style={{ width: isMobile ? "85%" : sidebarWidth }}
      >
        <div className="sticky top-0 p-4 bg-background/80 backdrop-blur-md z-10 flex justify-between items-center border-b border-border/50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Resources
        </h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(false)}>
              <X className="w-5 h-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        <div className="p-4">
          <RightSide
            rightSidebarOpen={rightSidebarOpen}
            setRightSidebarOpen={setRightSidebarOpen}
            sidebarWidth={sidebarWidth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            sampleData={sampleData}
            selectedNode={selectedNode}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <main
        ref={mainRef}
        className={cn(
          "relative min-h-screen transition-all duration-300 ease-in-out pt-16",
          leftSidebarOpen && !isMobile ? "md:ml-[320px]" : "",
          rightSidebarOpen && !isMobile ? "md:mr-[320px]" : ""
        )}
        style={{
          width: getMainContentWidth(),
          marginLeft: leftSidebarOpen && !isMobile ? "320px" : "0",
          marginRight: rightSidebarOpen && !isMobile ? "320px" : "0",
        }}
      >
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/50 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="relative"
            >
              {isMobile || !leftSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              <span className="sr-only">Toggle left sidebar</span>
              <motion.span
                className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: leftSidebarOpen ? 1 : 0,
                  scale: leftSidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                style={{ translateX: "-50%" }}
              />
            </Button>
            <h1 className="text-xl font-bold hidden md:block">Learning Roadmap</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="relative"
            >
              {isMobile || !rightSidebarOpen ? <CalendarIcon className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <span className="sr-only">Toggle right sidebar</span>
              <motion.span
                className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: rightSidebarOpen ? 1 : 0,
                  scale: rightSidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                style={{ translateX: "-50%" }}
              />
            </Button>
          </div>
        </div>
        
        {/* Roadmap Cards */}
        <div className="p-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {sampleData.map((node) => (
              <motion.div
                key={node.id}
                id={`node-${node.id}`}
                className={cn("relative overflow-hidden", node.status === "locked" ? "opacity-70" : "")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className={cn(
                    "h-full border border-border/50 shadow-sm transition-all duration-300",
                    selectedNode === node.id ? "ring-2 ring-primary shadow-lg" : "",
                    "hover:shadow-md cursor-pointer"
                  )}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <CardContent className="p-6">
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", getStatusColor(node.status))} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            node.status === "completed"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : node.status === "in-progress"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-gray-100 dark:bg-gray-800/50"
                          )}
                        >
                          {getStatusIcon(node.status)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{node.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{node.category}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{node.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {node.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className={cn("bg-background/50 hover:bg-background/80", node.status === "in-progress" && "animate-pulse")}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {selectedNode === node.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-border/50"
                        >
                          <h4 className="text-sm font-medium mb-2">Related Companies</h4>
                          <div className="flex flex-wrap gap-2">
                            {node.companyRelevance.map((company) => (
                              <Badge key={company} variant="outline">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
         
        </div>
      </main>
      
      {/* Mobile overlay when sidebar is open */}
      {isMobile && (leftSidebarOpen || rightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => {
            setLeftSidebarOpen(false)
            setRightSidebarOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default RoadmapComponent