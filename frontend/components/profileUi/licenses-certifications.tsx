"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Plus, Trash2, Calendar, Link2, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import FileUpload from "./file-upload"

// Replace with your actual AuthProvider hook
import { useAuth } from "@/auth/AuthProvider"

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string        // local state as "YYYY-MM"
  expirationDate?: string  // local state as "YYYY-MM"
  credentialUrl?: string
  credentialId?: string
  // file?: File              // only stored locally, not in DB
}

export default function LicensesCertifications() {
  const { supabase, user } = useAuth()

  // ----------------------------------------------------------------
  // 1) State: list of certifications from DB + new certification form
  // ----------------------------------------------------------------
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // ----------------------------------------------------------------
  // 2) Fetch all certifications for the logged-in user on mount
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!user) return

    const fetchCertifications = async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Error fetching certifications:", error.message)
      } else if (data) {
        // Map DB columns to our local interface
        setCertifications(
          data.map((cert) => ({
            id: cert.id,
            name: cert.name,
            issuer: cert.issuer,
            // Convert "YYYY-MM-DD" from DB to "YYYY-MM" for local state
            issueDate: cert.issue_date ? cert.issue_date.slice(0, 7) : "",
            expirationDate: cert.expiration_date ? cert.expiration_date.slice(0, 7) : "",
            credentialId: cert.credential_id ?? "",
            credentialUrl: cert.credential_url ?? "",
            // file: undefined,
          }))
        )
      }
    }

    fetchCertifications()
  }, [user, supabase])

  // ----------------------------------------------------------------
  // 3) Insert a new certification
  // ----------------------------------------------------------------
  const handleAddCertification = async () => {
    if (!user) return

    // Ensure required fields
    if (newCertification.name && newCertification.issuer && newCertification.issueDate) {
      // Convert "YYYY-MM" to "YYYY-MM-01" for the DB (date column)
      const issueDateForDB = newCertification.issueDate
        ? `${newCertification.issueDate}-01`
        : null
      const expirationDateForDB = newCertification.expirationDate
        ? `${newCertification.expirationDate}-01`
        : null

      const certToInsert = {
        user_id: user.id,
        name: newCertification.name,
        issuer: newCertification.issuer,
        issue_date: issueDateForDB,
        expiration_date: expirationDateForDB,
        credential_id: newCertification.credentialId || null,
        credential_url: newCertification.credentialUrl || null,
      }

      const { data, error } = await supabase
        .from("certifications")
        .insert(certToInsert)
        .select()
        .single()

      if (error) {
        console.error("❌ Error inserting certification:", error.message)
      } else if (data) {
        // Update local state
        setCertifications([
          ...certifications,
          {
            id: data.id,
            name: data.name,
            issuer: data.issuer,
            issueDate: data.issue_date ? data.issue_date.slice(0, 7) : "",
            expirationDate: data.expiration_date ? data.expiration_date.slice(0, 7) : "",
            credentialId: data.credential_id ?? "",
            credentialUrl: data.credential_url ?? "",
            // file: undefined,
          },
        ])
        // Reset form & close dialog
        setNewCertification({})
        setIsDialogOpen(false)
      }
    }
  }

  // ----------------------------------------------------------------
  // 4) Delete a certification by ID
  // ----------------------------------------------------------------
  const handleDeleteCertification = async (id: string) => {
    if (!user) return

    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ Error deleting certification:", error.message)
    } else {
      // Remove from local state
      setCertifications(certifications.filter((cert) => cert.id !== id))
    }
  }

  // ----------------------------------------------------------------
  // 5) Handle file selection (optional)
  // ----------------------------------------------------------------
  // const handleFileSelect = (file: File) => {
  //   setNewCertification({ ...newCertification, file })
  //   // If you want to upload to Supabase Storage, do it here
  // }

  // ----------------------------------------------------------------
  // 6) Generic input handler
  // ----------------------------------------------------------------
  const handleInputChange = (field: keyof Certification, value: string) => {
    setNewCertification({ ...newCertification, [field]: value })
  }

  // ----------------------------------------------------------------
  // 7) Month/Year logic + date formatting
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const monthIndex = Number.parseInt(month) - 1
    return `${months[monthIndex]} ${year}`
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Licenses & Certifications</CardTitle>

        {/* Dialog for adding a new certification */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Certification
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto w-[95vw] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Add Certification</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Certification Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Certification Name*</Label>
                <Input
                  id="name"
                  value={newCertification.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              {/* Issuer */}
              <div className="grid gap-2">
                <Label htmlFor="issuer">Issuing Organization*</Label>
                <Input
                  id="issuer"
                  value={newCertification.issuer || ""}
                  onChange={(e) => handleInputChange("issuer", e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              {/* Issue / Expiration Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Issue Date */}
                <div className="grid gap-2">
                  <Label>Issue Date*</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newCertification.issueDate?.split("-") || ["", ""]
                        handleInputChange("issueDate", `${currentDate[0]}-${value}`)
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
                        const currentDate = newCertification.issueDate?.split("-") || ["", ""]
                        handleInputChange("issueDate", `${value}-${currentDate[1]}`)
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

                {/* Expiration Date */}
                <div className="grid gap-2">
                  <Label>Expiration Date</Label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newCertification.expirationDate?.split("-") || ["", ""]
                        handleInputChange("expirationDate", `${currentDate[0]}-${value}`)
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
                        const currentDate = newCertification.expirationDate?.split("-") || ["", ""]
                        handleInputChange("expirationDate", `${value}-${currentDate[1]}`)
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

              {/* Credential ID */}
              <div className="grid gap-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={newCertification.credentialId || ""}
                  onChange={(e) => handleInputChange("credentialId", e.target.value)}
                  placeholder="e.g. AWS-123456"
                />
              </div>

              {/* Credential URL */}
              <div className="grid gap-2">
                <Label htmlFor="credentialUrl">Credential URL</Label>
                <Input
                  id="credentialUrl"
                  value={newCertification.credentialUrl || ""}
                  onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
                  placeholder="e.g. https://aws.amazon.com/verification"
                />
              </div>

              {/* File Upload (optional) */}
              {/* <div className="grid gap-2">
                <Label>Upload Certificate</Label>
                <FileUpload onFileSelect={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png" />
              </div> */}
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
              <Button onClick={handleAddCertification} className="w-full xs:w-auto">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* List of existing certifications */}
      <CardContent>
        <div className="space-y-6">
          {certifications.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No certifications added yet
              </p>
            </div>
          ) : (
            certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Award className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{cert.name}</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {cert.issuer}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Issued {formatDate(cert.issueDate)}</span>
                        </div>
                        {cert.expirationDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Expires {formatDate(cert.expirationDate)}</span>
                          </div>
                        )}
                      </div>
                      {cert.credentialId && (
                        <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-400">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs sm:text-sm mt-1"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>See credential</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCertification(cert.id)}
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
