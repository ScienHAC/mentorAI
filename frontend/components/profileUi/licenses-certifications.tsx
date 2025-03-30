"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Plus, Trash2, Calendar, Link2, ExternalLink } from "lucide-react"
import FileUpload from "./file-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/auth/AuthProvider";

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expirationDate?: string
  credentialUrl?: string
  credentialId?: string
  fileUrl?: string;
  file?: File
}

export default function LicensesCertifications() {
  const { supabase, user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [newCertification, setNewCertification] = useState<Partial<Certification>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchCertifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("licenses_certifications")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        console.error("❌ Error fetching certifications:", error.message);
      } else {
        setCertifications(
          data.map((cert) => ({
            id: cert.id,
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issue_date,
            expirationDate: cert.expiration_date || undefined,
            credentialId: cert.credential_id || undefined,
            credentialUrl: cert.credential_url || undefined,
            fileUrl: cert.file_url || undefined,
            file: undefined,
          }))
        );
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [user, fetchCertifications]);

  const handleAddCertification = async () => {
    if (!user || !newCertification.name || !newCertification.issuer || !newCertification.issueDate) return;

    let fileUrl = null;

    if (newCertification.file) {
      const filePath = `certifications/${user.id}/${new Date().getTime()}_${newCertification.file.name}`;

      const { error: fileError } = await supabase
        .storage
        .from("cert")
        .upload(filePath, newCertification.file);

      if (fileError) {
        console.error("❌ Error uploading file:", fileError.message);
        return;
      }

      // Get the public URL of the uploaded file
      fileUrl = supabase.storage.from("cert").getPublicUrl(filePath).data.publicUrl;
    }

    try {
      const { data, error } = await supabase.from("licenses_certifications").insert([
        {
          user_id: user.id,
          name: newCertification.name,
          issuer: newCertification.issuer,
          issue_date: newCertification.issueDate,
          expiration_date: newCertification.expirationDate || null,
          credential_id: newCertification.credentialId || null,
          credential_url: newCertification.credentialUrl || null,
          file_url: fileUrl, // Save the file URL instead of the file object
          created_at: new Date().toISOString(),
        },
      ]).select();

      if (error) {
        console.error("❌ Error adding certification:", error.message);
      } else if (data && data.length > 0) {
        const newCert: Certification = {
          id: data[0].id,
          name: data[0].name,
          issuer: data[0].issuer,
          issueDate: data[0].issue_date,
          expirationDate: data[0].expiration_date || undefined,
          credentialId: data[0].credential_id || undefined,
          credentialUrl: data[0].credential_url || undefined,
          fileUrl: data[0].file_url || undefined,
          file: undefined,
        };

        setCertifications((prev) => [...prev, newCert]);
        setNewCertification({});
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
    }
  };

  const handleDeleteCertification = async (id: string, fileUrl?: string) => {
    try {
      // Delete file from Supabase storage if fileUrl exists
      if (fileUrl) {
        // Fixed: Extract the correct file path
        const filePath = fileUrl.split("public/cert/")[1];
        const { error: fileError } = await supabase.storage
          .from('cert')
          .remove([filePath]);

        if (fileError) {
          console.error("❌ Error deleting file from storage:", fileError.message);
        } else {
          console.log("✅ File deleted successfully:", filePath);
        }
      }

      // Delete the certification record from the database
      const { error } = await supabase
        .from("licenses_certifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Error deleting certification:", error.message);
      } else {
        setCertifications(certifications.filter((cert) => cert.id !== id));
        console.log("✅ Certification deleted successfully.");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
    }
  };


  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("certifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "licenses_certifications" },
        () => {
          fetchCertifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchCertifications]);



  const handleFileSelect = (file: File) => {
    setNewCertification({
      ...newCertification,
      file,
    })
  }

  const handleInputChange = (field: keyof Certification, value: string) => {
    setNewCertification({
      ...newCertification,
      [field]: value,
    })
  }

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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Licenses & Certifications</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Certification</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Certification Name*</Label>
                <Input
                  id="name"
                  value={newCertification.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issuer">Issuing Organization*</Label>
                <Input
                  id="issuer"
                  value={newCertification.issuer || ""}
                  onChange={(e) => handleInputChange("issuer", e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Issue Date*</Label>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newCertification.issueDate?.split("-") || ["", ""]
                        handleInputChange("issueDate", `${currentDate[0]}-${value}`)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString().padStart(2, "0")}>
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

                <div className="grid gap-2">
                  <Label>Expiration Date</Label>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) => {
                        const currentDate = newCertification.expirationDate?.split("-") || ["", ""]
                        handleInputChange("expirationDate", `${currentDate[0]}-${value}`)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString().padStart(2, "0")}>
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={newCertification.credentialId || ""}
                  onChange={(e) => handleInputChange("credentialId", e.target.value)}
                  placeholder="e.g. AWS-123456"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="credentialUrl">Credential URL</Label>
                <Input
                  id="credentialUrl"
                  value={newCertification.credentialUrl || ""}
                  onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
                  placeholder="e.g. https://aws.amazon.com/verification"
                />
              </div>

              <div className="grid gap-2">
                <Label>Upload Certificate</Label>
                <FileUpload onFileSelect={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCertification}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {certifications.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No certifications added yet</p>
            </div>
          ) : (
            certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Award className="w-10 h-10 text-emerald-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Issued {cert.issueDate}</span>
                        </div>
                        {cert.expirationDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Expires {cert.expirationDate}</span>
                          </div>
                        )}
                      </div>
                      {cert.credentialId && <p className="text-sm mt-1">Credential ID: {cert.credentialId}</p>}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm mt-1"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>See credential</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {cert.fileUrl && (
                        <a
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" /> View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCertification(cert.id, cert.fileUrl)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8"
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

