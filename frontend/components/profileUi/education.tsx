"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Plus, Trash2, Calendar, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
// import FileUpload from "./file-upload"

// Import your custom AuthProvider hook
import { useAuth } from "@/auth/AuthProvider"

// Match these fields to your DB columns
interface Education {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  location?: string
  startDate: string    // We'll store "YYYY-MM" locally
  endDate?: string     // Also "YYYY-MM"
  grade?: string
  activities?: string
  description?: string
  // file?: File          // Only stored locally, not in DB
}

export default function EducationTab() {
  const { supabase, user } = useAuth()

  // We'll fetch from the DB, so start with an empty array
  const [educations, setEducations] = useState<Education[]>([])
  const [newEducation, setNewEducation] = useState<Partial<Education>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // ----------------------------------------------------------------
  // 1) Fetch education rows for the logged-in user on component mount
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!user) return

    const fetchEducation = async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Error fetching education:", error.message)
      } else if (data) {
        // Map DB columns to our interface
        setEducations(
          data.map((edu) => ({
            id: edu.id,
            school: edu.institution_name,
            degree: edu.degree,
            fieldOfStudy: edu.field_of_study,
            location: edu.location ?? "",
            // Convert "YYYY-MM-DD" from DB to "YYYY-MM" for local state
            startDate: edu.start_date ? edu.start_date.slice(0, 7) : "",
            endDate: edu.end_date ? edu.end_date.slice(0, 7) : "",
            grade: edu.grade ?? "",
            activities: edu.activities ?? "",
            description: edu.description ?? "",
            // file: undefined, // file is not stored in DB
          }))
        )
      }
    }

    fetchEducation()
  }, [user, supabase])

  // ----------------------------------------------------------------
  // 2) Insert a new education row for the logged-in user
  // ----------------------------------------------------------------
  const handleAddEducation = async () => {
    if (!user) return

    // Ensure required fields
    if (
      newEducation.school &&
      newEducation.degree &&
      newEducation.fieldOfStudy &&
      newEducation.startDate
    ) {
      // Convert "YYYY-MM" to a full date string for DB insertion (YYYY-MM-01)
      const startDateForDB = newEducation.startDate
        ? `${newEducation.startDate}-01`
        : null

      const endDateForDB = newEducation.endDate
        ? `${newEducation.endDate}-01`
        : null

      const educationToInsert = {
        user_id: user.id,
        institution_name: newEducation.school,
        degree: newEducation.degree,
        field_of_study: newEducation.fieldOfStudy,
        location: newEducation.location || null,
        start_date: startDateForDB,
        end_date: endDateForDB,
        grade: newEducation.grade || null,
        activities: newEducation.activities || null,
        description: newEducation.description || null,
      }

      const { data, error } = await supabase
        .from("education")
        .insert(educationToInsert)
        .select()
        .single()

      if (error) {
        console.error("❌ Error inserting education:", error.message)
      } else if (data) {
        // Add the newly inserted row to our local state
        setEducations([
          ...educations,
          {
            id: data.id,
            school: data.institution_name,
            degree: data.degree,
            fieldOfStudy: data.field_of_study,
            location: data.location ?? "",
            startDate: data.start_date ? data.start_date.slice(0, 7) : "",
            endDate: data.end_date ? data.end_date.slice(0, 7) : "",
            grade: data.grade ?? "",
            activities: data.activities ?? "",
            description: data.description ?? "",
            // file: undefined,
          },
        ])
        // Reset form and close dialog
        setNewEducation({})
        setIsDialogOpen(false)
      }
    }
  }

  // ----------------------------------------------------------------
  // 3) Delete an education row by its ID
  // ----------------------------------------------------------------
  const handleDeleteEducation = async (id: string) => {
    if (!user) return

    const { error } = await supabase
      .from("education")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ Error deleting education:", error.message)
    } else {
      // Remove from local state
      setEducations(educations.filter((edu) => edu.id !== id))
    }
  }

  // ----------------------------------------------------------------
  // 4) Handle file uploads (optional)
  // ----------------------------------------------------------------
  // const handleFileSelect = (file: File) => {
  //   setNewEducation({ ...newEducation, file })
  // }

  // ----------------------------------------------------------------
  // 5) Generic input change handler
  // ----------------------------------------------------------------
  const handleInputChange = (field: keyof Education, value: string) => {
    setNewEducation({ ...newEducation, [field]: value })
  }

  // ----------------------------------------------------------------
  // 6) Month and year dropdown logic
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
  // 7) Helper to display "YYYY-MM" as "Month YYYY"
  // ----------------------------------------------------------------
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const monthIndex = Number.parseInt(month) - 1
    return `${months[monthIndex]} ${year}`
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Education</CardTitle>

        {/* Dialog for adding new education */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto w-[95vw] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* School */}
              <div className="grid gap-2">
                <Label htmlFor="school">School*</Label>
                <Input
                  id="school"
                  value={newEducation.school || ""}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  placeholder="e.g. Stanford University"
                />
              </div>

              {/* Degree */}
              <div className="grid gap-2">
                <Label htmlFor="degree">Degree*</Label>
                <Input
                  id="degree"
                  value={newEducation.degree || ""}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                />
              </div>

              {/* Field of Study */}
              <div className="grid gap-2">
                <Label htmlFor="fieldOfStudy">Field of Study*</Label>
                <Input
                  id="fieldOfStudy"
                  value={newEducation.fieldOfStudy || ""}
                  onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEducation.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g. Stanford, CA"
                />
              </div>

              {/* Start / End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="grid gap-2">
                  <Label>Start Date*</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newEducation.startDate?.split("-") || ["", ""]
                        // Keep the year, update the month
                        handleInputChange("startDate", `${currentDate[0]}-${value}`)
                      }}
                    >
                      <SelectTrigger className="w-full">
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
                        const currentDate = newEducation.startDate?.split("-") || ["", ""]
                        // Keep the month, update the year
                        handleInputChange("startDate", `${value}-${currentDate[1]}`)
                      }}
                    >
                      <SelectTrigger className="w-full">
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

                {/* End Date */}
                <div className="grid gap-2">
                  <Label>End Date (or Expected)</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newEducation.endDate?.split("-") || ["", ""]
                        handleInputChange("endDate", `${currentDate[0]}-${value}`)
                      }}
                    >
                      <SelectTrigger className="w-full">
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
                        const currentDate = newEducation.endDate?.split("-") || ["", ""]
                        handleInputChange("endDate", `${value}-${currentDate[1]}`)
                      }}
                    >
                      <SelectTrigger className="w-full">
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
              </div>

              {/* Grade */}
              <div className="grid gap-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={newEducation.grade || ""}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                  placeholder="e.g. 3.8 GPA"
                />
              </div>

              {/* Activities */}
              <div className="grid gap-2">
                <Label htmlFor="activities">Activities and Societies</Label>
                <Input
                  id="activities"
                  value={newEducation.activities || ""}
                  onChange={(e) => handleInputChange("activities", e.target.value)}
                  placeholder="e.g. Coding Club, Robotics Team"
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEducation.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your studies, achievements, etc."
                  className="min-h-[100px]"
                />
              </div>

              {/* File Upload (optional) */}
              {/* <div className="grid gap-2">
                <Label>Upload Diploma/Certificate</Label>
                <FileUpload onFileSelect={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png" />
              </div>*/}
            </div> 

            {/* Dialog Buttons */}
            <div className="flex flex-col xs:flex-row justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full xs:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleAddEducation} className="w-full xs:w-auto">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* Education List */}
      <CardContent>
        <div className="space-y-6">
          {educations.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No education added yet
              </p>
            </div>
          ) : (
            educations.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 flex-shrink-0" />
                    <div className="space-y-1 sm:space-y-0">
                      <h3 className="font-semibold text-base sm:text-lg">
                        {edu.school}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {edu.degree}, {edu.fieldOfStudy}
                      </p>
                      {edu.location && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{edu.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {formatDate(edu.startDate)} -{" "}
                          {edu.endDate ? formatDate(edu.endDate) : "Present"}
                        </span>
                      </div>
                      {edu.grade && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Grade: {edu.grade}
                        </p>
                      )}
                      {edu.activities && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Activities: {edu.activities}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 mt-2 sm:mt-0 ml-auto sm:ml-0"
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
