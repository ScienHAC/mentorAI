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
import { useAuth } from "@/auth/AuthProvider"

// Updated interface to match database columns
interface Experience {
  id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description?: string
}

export default function ExperienceTab() {
  const { supabase, user } = useAuth()

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    current: false,
  })
  const [isChecked, setIsChecked] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch experiences for the current user
  const fetchExperiences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Error fetching experiences:", error.message)
      } else {
        setExperiences(data || [])
      }
    } catch (err) {
      console.error("❌ Unexpected error fetching experiences:", err)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [user])

  // Add new experience
  const handleAddExperience = async () => {
    if (!user || !newExperience.title || !newExperience.company || !newExperience.start_date) {
      console.log("Missing required fields")
      return
    }

    try {
      const experienceToInsert = {
        user_id: user.id,
        title: newExperience.title,
        company: newExperience.company,
        location: newExperience.location || null,
        start_date: newExperience.start_date,
        end_date: newExperience.current ? null : newExperience.end_date || null,
        current: newExperience.current || false,
        description: newExperience.description || null,
      }

      const { data, error } = await supabase
        .from("experiences")
        .insert(experienceToInsert)
        .select()

      if (error) {
        console.error("❌ Error adding experience:", error.message)
      } else {
        // Refresh experiences
        fetchExperiences()
        // Reset form
        setNewExperience({ current: false })
        setIsChecked(false)
        setIsDialogOpen(false)
      }
    } catch (err) {
      console.error("❌ Unexpected error adding experience:", err)
    }
  }

  // Delete experience
  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("❌ Error deleting experience:", error.message)
      } else {
        setExperiences(experiences.filter((exp) => exp.id !== id))
      }
    } catch (err) {
      console.error("❌ Unexpected error deleting experience:", err)
    }
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    const value = Boolean(checked)
    setIsChecked(value)
    handleInputChange("current", value)

    if (value) {
      handleInputChange("end_date", undefined)
    }
  }

  // Handle input changes
  const handleInputChange = <K extends keyof Experience>(
    field: K,
    value: Experience[K]
  ) => {
    setNewExperience({
      ...newExperience,
      [field]: value,
    })
  }

  // Months and years for dropdowns
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

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    // Handle already formatted date or YYYY-MM
    if (dateString.includes(" ")) return dateString

    const parts = dateString.split("-")
    if (parts.length < 2) return dateString

    const year = parts[0]
    const monthIndex = parseInt(parts[1]) - 1

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return dateString

    return `${months[monthIndex]} ${year}`
  }

  // Listen for realtime changes
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel("experiences-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "experiences" },
        () => {
          fetchExperiences()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

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
                <Label htmlFor="title">Role Title*</Label>
                <Input
                  id="title"
                  value={newExperience.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>

              {/* Company Name */}
              <div className="grid gap-2">
                <Label htmlFor="company">Company*</Label>
                <Input
                  id="company"
                  value={newExperience.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
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
                        const currentDate = newExperience.start_date?.split("-") || ["", ""]
                        handleInputChange(
                          "start_date",
                          `${currentDate[0] || ""}-${value}`
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
                        const currentDate = newExperience.start_date?.split("-") || ["", ""]
                        handleInputChange(
                          "start_date",
                          `${value}-${currentDate[1] || ""}`
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
                          const currentDate = newExperience.end_date?.split("-") || ["", ""]
                          handleInputChange(
                            "end_date",
                            `${currentDate[0] || ""}-${value}`
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
                          const currentDate = newExperience.end_date?.split("-") || ["", ""]
                          handleInputChange(
                            "end_date",
                            `${value}-${currentDate[1] || ""}`
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
                          {exp.title}
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
                        {exp.company}
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
                          {formatDate(exp.start_date)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.end_date)}
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