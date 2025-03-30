"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Plus, Trash2, Calendar, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
// import FileUpload from "./file-upload"
import { useAuth } from "@/auth/AuthProvider"

// ----------------------------------------------------
// Adjust the interface to use `role_title` instead of `title`.
// Also note that the DB does not have a `current` column.
// We handle "current" on the client by setting `end_date = null`.
// ----------------------------------------------------
interface Experience {
  id: string
  role_title: string
  company_name: string
  location?: string
  startDate: string       // local state for the start date
  endDate?: string        // local state for the end date
  current: boolean        // not stored in DB, derived from end_date
  description?: string
  file?: File
}

export default function ExperienceTab() {
  const { supabase, user } = useAuth()

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    current: false,
  })
  const [isChecked, setIsChecked] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // ----------------------------------------------------
  // Fetch experiences for the current user on mount.
  // Map `role_title` from DB to `role_title` in the interface,
  // and derive `current` based on whether `end_date` is null.
  // ----------------------------------------------------
  useEffect(() => {
    if (!user) return

    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Error fetching experiences:", error.message)
      } else {
        setExperiences(
          data.map((exp) => ({
            id: exp.id,
            // Map the DB column `role_title` to our interface
            role_title: exp.role_title,
            company_name: exp.company_name,
            location: exp.location,
            // Convert date columns to strings like "YYYY-MM"
            startDate: exp.start_date ?? "",
            endDate: exp.end_date ?? "",
            description: exp.description,
            // If `end_date` is null, treat it as currently working
            current: exp.end_date == null,
          }))
        )
      }
    }

    fetchExperiences()
  }, [user, supabase])

  // ----------------------------------------------------
  // Insert a new experience.
  // We map our local `role_title` to the DB column `role_title`.
  // If `current` is true, we set `end_date` to null.
  // ----------------------------------------------------
  const handleAddExperience = async () => {
    if (!user) return

    // Ensure required fields are filled
    if (newExperience.role_title && newExperience.company_name && newExperience.startDate) {
      const experienceToInsert = {
        user_id: user.id,
        role_title: newExperience.role_title,
        company_name: newExperience.company_name,
        location: newExperience.location,
        start_date: newExperience.startDate
          ? `${newExperience.startDate}-01`
          : null,
        end_date: newExperience.current
          ? null
          : newExperience.endDate
            ? `${newExperience.endDate}-01`
            : null,
        description: newExperience.description || null,
      }

      const { data, error } = await supabase
        .from("experiences")
        .insert(experienceToInsert)
        .select() // Return the inserted row
        .single()

      if (error) {
        console.error("❌ Error inserting experience:", error.message)
      } else {
        setExperiences([
          ...experiences,
          {
            id: data.id,
            role_title: data.role_title,
            company_name: data.company_name,
            location: data.location,
            startDate: data.start_date ?? "",
            endDate: data.end_date ?? "",
            description: data.description,
            // If end_date is null, treat it as current
            current: data.end_date == null,
          },
        ])
        // Reset the new experience form
        setNewExperience({ current: false })
        setIsDialogOpen(false)
      }
    }
  }

  // ----------------------------------------------------
  // Delete an experience by id.
  // ----------------------------------------------------
  const handleDeleteExperience = async (id: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id)

    if (error) {
      console.error("❌ Error deleting experience:", error.message)
    } else {
      setExperiences(experiences.filter((exp) => exp.id !== id))
    }
  }

  // ----------------------------------------------------
  // Handle the "I am currently working in this role" checkbox.
  // If checked, set `endDate` to undefined (so it becomes null in DB).
  // ----------------------------------------------------
  const handleCheckboxChange = (checked: boolean) => {
    const value = Boolean(checked)
    setIsChecked(value)
    handleInputChange("current", value)

    if (value) {
      handleInputChange("endDate", undefined)
    }
  }

  // ----------------------------------------------------
  // File upload logic (optional).
  // ----------------------------------------------------
  // const handleFileSelect = (file: File) => {
  //   setNewExperience({
  //     ...newExperience,
  //     file,
  //   })
  // }

  // ----------------------------------------------------
  // Generic handler for input changes in newExperience.
  // ----------------------------------------------------
  const handleInputChange = <K extends keyof Experience>(
    field: K,
    value: Experience[K]
  ) => {
    setNewExperience({
      ...newExperience,
      [field]: value,
    })
  }

  // ----------------------------------------------------
  // Month and year arrays for the date dropdowns.
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Helper to format a DB date (YYYY-MM) into "Month YYYY".
  // ----------------------------------------------------
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const monthIndex = Number.parseInt(month) - 1
    return `${months[monthIndex]} ${year}`
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mx-auto">
        <CardTitle>Experience</CardTitle>

        {/* Dialog for adding a new experience */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto w-[95vw]">
            <DialogHeader>
              <DialogTitle>Add Experience</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Role Title */}
              <div className="grid gap-2">
                <Label htmlFor="role_title">Role Title*</Label>
                <Input
                  id="role_title"
                  value={newExperience.role_title || ""}
                  onChange={(e) => handleInputChange("role_title", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>

              {/* Company Name */}
              <div className="grid gap-2">
                <Label htmlFor="company_name">Company*</Label>
                <Input
                  id="company_name"
                  value={newExperience.company_name || ""}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="e.g. Tech Solutions Inc."
                />
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newExperience.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="grid gap-2">
                  <Label>Start Date*</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newExperience.startDate?.split("-") || ["", ""]
                        handleInputChange(
                          "startDate",
                          `${currentDate[0] || "0000"}-${value}`
                        )
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
                        const currentDate = newExperience.startDate?.split("-") || ["", ""]
                        handleInputChange(
                          "startDate",
                          `${value}-${currentDate[1] || "00"}`
                        )
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

                {/* End Date (only if not current) */}
                {!newExperience.current && (
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <Select
                        onValueChange={(value) => {
                          const currentDate = newExperience.endDate?.split("-") || ["", ""]
                          handleInputChange(
                            "endDate",
                            `${currentDate[0] || "0000"}-${value}`
                          )
                        }}
                        disabled={newExperience.current}
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
                          const currentDate = newExperience.endDate?.split("-") || ["", ""]
                          handleInputChange(
                            "endDate",
                            `${value}-${currentDate[1] || "00"}`
                          )
                        }}
                        disabled={newExperience.current}
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

              {/* Current role checkbox */}
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
                  I am currently working in this role
                </span>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newExperience.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[100px]"
                />
              </div>

              {/* File Upload (optional) */}
              {/* <div className="grid gap-2">
                <Label>Upload Supporting Document</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div> */}
            </div>

            {/* Dialog buttons */}
            <div className="flex flex-col xs:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full xs:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleAddExperience} className="w-full xs:w-auto">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* Existing Experiences List */}
      <CardContent>
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No experience added yet
              </p>
            </div>
          ) : (
            experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Briefcase className="w-10 h-10 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                        <h3 className="font-semibold text-lg">
                          {exp.role_title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 sm:hidden self-end"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {exp.company_name}
                      </p>
                      {exp.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="break-words">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 hidden sm:flex"
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
