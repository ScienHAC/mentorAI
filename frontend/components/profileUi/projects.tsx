"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderGit2, Plus, Trash2, Calendar, ExternalLink, Github } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
// import FileUpload from "./file-upload"

// Import your custom AuthProvider hook
import { useAuth } from "@/auth/AuthProvider"

interface Project {
  id: string
  name: string
  type: string
  start_date: string
  end_date?: string
  ongoing: boolean
  description?: string
  technologies?: string[]
  repo_url?: string
  demo_url?: string
  // file?: File
}

export default function ProjectsTab() {
  const { supabase, user } = useAuth()

  // ----------------------------------------------------------------
  // State
  // ----------------------------------------------------------------
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Partial<Project>>({
    ongoing: false,
    technologies: [],
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)  // For "ongoing" checkbox
  const [techInput, setTechInput] = useState("")

  // ----------------------------------------------------------------
  // Fetch projects from Supabase on mount
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!user) return

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Error fetching projects:", error.message)
      } else if (data) {
        // Map DB fields to our local Project interface
        const mapped = data.map((proj) => ({
          id: proj.id,
          name: proj.name,
          type: proj.type,
          start_date: proj.start_date,
          end_date: proj.end_date,
          ongoing: proj.ongoing,
          description: proj.description,
          technologies: proj.technologies,
          repo_url: proj.repo_url,
          demo_url: proj.demo_url,
        }))
        setProjects(mapped)
      }
    }

    fetchProjects()
  }, [user, supabase])

  // ----------------------------------------------------------------
  // Insert a new project into Supabase
  // ----------------------------------------------------------------
  const handleAddProject = async () => {
    if (!user) return

    if (newProject.name && newProject.type && newProject.start_date) {
      const insertObj = {
        user_id: user.id,
        name: newProject.name,
        type: newProject.type,
        start_date: newProject.start_date,
        end_date: newProject.ongoing ? null : newProject.end_date,
        ongoing: newProject.ongoing,
        description: newProject.description || null,
        technologies: newProject.technologies || [],
        repo_url: newProject.repo_url || null,
        demo_url: newProject.demo_url || null,
      }

      const { data, error } = await supabase
        .from("projects")
        .insert(insertObj)
        .select()
        .single()

      if (error) {
        console.error("❌ Error inserting project:", error.message)
      } else if (data) {
        // Update local state
        setProjects([
          ...projects,
          {
            id: data.id,
            name: data.name,
            type: data.type,
            start_date: data.start_date,
            end_date: data.end_date,
            ongoing: data.ongoing,
            description: data.description,
            technologies: data.technologies,
            repo_url: data.repo_url,
            demo_url: data.demo_url,
          },
        ])
        // Reset form
        setNewProject({ ongoing: false, technologies: [] })
        setTechInput("")
        setIsChecked(false)
        setIsDialogOpen(false)
      }
    }
  }

  // ----------------------------------------------------------------
  // Delete a project
  // ----------------------------------------------------------------
  const handleDeleteProject = async (id: string) => {
    if (!user) return

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ Error deleting project:", error.message)
    } else {
      // Remove from local state
      setProjects(projects.filter((proj) => proj.id !== id))
    }
  }

  // ----------------------------------------------------------------
  // Checkbox for "ongoing" project
  // ----------------------------------------------------------------
  const handleCheckboxChange = (checked: boolean) => {
    const value = Boolean(checked)
    setIsChecked(value)
    handleInputChange("ongoing", value)

    if (value) {
      handleInputChange("end_date", undefined)
    }
  }

  // ----------------------------------------------------------------
  // Generic input handler
  // ----------------------------------------------------------------
  const handleInputChange = <K extends keyof Project>(field: K, value: Project[K]) => {
    setNewProject({ ...newProject, [field]: value })
  }

  // ----------------------------------------------------------------
  // Technology tags
  // ----------------------------------------------------------------
  const handleAddTechnology = () => {
    if (techInput && !newProject.technologies?.includes(techInput)) {
      setNewProject({
        ...newProject,
        technologies: [...(newProject.technologies || []), techInput],
      })
      setTechInput("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies?.filter((t) => t !== tech),
    })
  }

  // ----------------------------------------------------------------
  // Month / Year arrays
  // ----------------------------------------------------------------
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  // ----------------------------------------------------------------
  // Helper to display date in "Month YYYY" format
  // ----------------------------------------------------------------
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const monthIndex = Number.parseInt(month) - 1
    return `${months[monthIndex]} ${year}`
  }

  // ----------------------------------------------------------------
  // Project types for the dropdown
  // ----------------------------------------------------------------
  const projectTypes = [
    "Web Application",
    "Mobile App",
    "Desktop Application",
    "Machine Learning",
    "Data Analysis",
    "Game Development",
    "IoT",
    "Blockchain",
    "Other",
  ]

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Projects</CardTitle>

        {/* Dialog for adding a new project */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Project Name */}
              <div className="grid gap-2">
                <Label htmlFor="projectName">Project Name*</Label>
                <Input
                  id="projectName"
                  value={newProject.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. E-commerce Platform"
                  autoComplete="off"
                />
              </div>

              {/* Project Type */}
              <div className="grid gap-2">
                <Label htmlFor="type">Project Type*</Label>
                <Select
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger id="type" name="type">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start / End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="grid gap-2">
                  <Label>Start Date*</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newProject.start_date?.split("-") || ["", ""]
                        handleInputChange("start_date", `${currentDate[0]}-${value}`)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem
                            key={month}
                            value={(index + 1).toString().padStart(2, "0")}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) => {
                        const currentDate = newProject.start_date?.split("-") || ["", ""]
                        handleInputChange("start_date", `${value}-${currentDate[1]}`)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* End Date (only if not ongoing) */}
                {!newProject.ongoing && (
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <Select
                        onValueChange={(value) => {
                          const currentDate = newProject.end_date?.split("-") || ["", ""]
                          handleInputChange("end_date", `${currentDate[0]}-${value}`)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem
                              key={month}
                              value={(index + 1).toString().padStart(2, "0")}
                            >
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(value) => {
                          const currentDate = newProject.end_date?.split("-") || ["", ""]
                          handleInputChange("end_date", `${value}-${currentDate[1]}`)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Ongoing checkbox */}
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => handleCheckboxChange(!isChecked)}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={handleCheckboxChange}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm font-medium leading-none">
                  This is an ongoing project
                </span>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your project, its purpose, and your role..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Technologies Used */}
              <div className="grid gap-2">
                <Label>Technologies Used</Label>
                <div className="flex flex-col xs:flex-row gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. React"
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTechnology()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTechnology}
                    variant="outline"
                    className="w-full xs:w-auto"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.technologies?.map((tech) => (
                    <div
                      key={tech}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTechnology(tech)}
                        className="text-blue-500 hover:text-blue-700 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repository URL */}
              <div className="grid gap-2">
                <Label htmlFor="repoUrl">Repository URL</Label>
                <Input
                  id="repoUrl"
                  value={newProject.repo_url || ""}
                  onChange={(e) => handleInputChange("repo_url", e.target.value)}
                  placeholder="e.g. https://github.com/username/project"
                  autoComplete="url"
                />
              </div>

              {/* Demo URL */}
              <div className="grid gap-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  value={newProject.demo_url || ""}
                  onChange={(e) => handleInputChange("demo_url", e.target.value)}
                  placeholder="e.g. https://project-demo.example.com"
                  autoComplete="url"
                />
              </div>

              {/* File Upload (optional) */}
              {/* <div className="grid gap-2">
                <Label>Upload Project Image/Screenshot</Label>
                <FileUpload onFileSelect={handleFileSelect} accept=".jpg,.jpeg,.png,.gif" />
              </div> */}
            </div>

            {/* Dialog Actions */}
            <div className="flex flex-col xs:flex-row justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full xs:w-auto order-2 xs:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProject}
                className="w-full xs:w-auto order-1 xs:order-2"
              >
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* Projects List */}
      <CardContent>
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderGit2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No projects added yet
              </p>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-col xs:flex-row gap-3">
                    <FolderGit2 className="w-10 h-10 text-orange-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {project.type}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs xs:text-sm">
                          {formatDate(project.start_date)} -{" "}
                          {project.ongoing
                            ? "Present"
                            : formatDate(project.end_date)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 line-clamp-3 sm:line-clamp-none">
                          {project.description}
                        </p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
                          >
                            <Github className="w-4 h-4" />
                            <span>Repository</span>
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 self-start sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}