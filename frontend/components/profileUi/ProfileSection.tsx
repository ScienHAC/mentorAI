import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Upload, Award, ArrowRight, Pencil, Save, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/auth/AuthProvider"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function ProfileSection() {
  const router = useRouter()
  const { supabase, user } = useAuth()

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    university: "Tech University",
    course: "",
    yearOfJoining: "2021",
    avatarUrl: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const courseOptions = [
    { value: "btech-cse-core", label: "B.Tech CSE Core" },
    { value: "btech-cse-aiml", label: "B.Tech CSE (AI & ML)" },
    { value: "btech-cse-cyber", label: "B.Tech CSE (Cybersecurity)" },
    { value: "btech-cse-iot", label: "B.Tech CSE (IoT)" },
    { value: "btech-cse-blockchain", label: "B.Tech CSE (Blockchain)" },
    { value: "btech-cse-ds", label: "B.Tech CSE (Data Science)" },
    { value: "btech-civil", label: "B.Tech Civil Engineering" },
    { value: "btech-mechanical", label: "B.Tech Mechanical Engineering" },
    { value: "btech-electrical", label: "B.Tech Electrical Engineering" },
    { value: "btech-ece", label: "B.Tech Electronics & Communication" },
    { value: "mca-general", label: "MCA General" },
    { value: "mca-aiml", label: "MCA (AI & ML)" },
    { value: "mca-cyber", label: "MCA (Cybersecurity)" },
    { value: "mca-cloud", label: "MCA (Cloud Computing)" },
    { value: "bca-general", label: "BCA General" },
    { value: "bca-aiml", label: "BCA (AI & ML)" },
    { value: "bca-cyber", label: "BCA (Cybersecurity)" },
    { value: "bca-web", label: "BCA (Web Technologies)" },
  ]

  const filteredCourses = searchTerm.trim() === ""
    ? courseOptions
    : courseOptions.filter(course =>
      course.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.value.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const joinYears = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - 5 + i).toString()
  )

  useEffect(() => {
    if (!user) {
      console.log("No user logged in.")
      return
    }

    const fetchProfile = async () => {
      if (!user) {
        console.log("No user logged in.")
        return
      }
    
      try {
        // First check if profile exists to avoid multiple results error
        const { data: profileExists, error: countError } = await supabase
          .from("profiles")
          .select("id", { count: "exact" })
          .eq("id", user.id)
        
        if (countError) {
          console.error("❌ Error checking profile existence:", countError.message)
          return
        }
        
        // If no profile exists, create one
        if (profileExists.length === 0) {
          console.log("No profile found, creating one...")
          
          const newProfile = {
            id: user.id,
            email: user.email || "",
            username: user.user_metadata?.user_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            full_name: user.user_metadata?.name || "New User",
            university: "Tech University",
            year_of_joining: "2021",
            course: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([newProfile])
          
          if (insertError) {
            console.error("❌ Error creating profile:", insertError.message)
            return
          }
          
          setProfileData({
            fullName: newProfile.full_name,
            email: newProfile.email,
            university: newProfile.university,
            course: newProfile.course,
            yearOfJoining: newProfile.year_of_joining,
            avatarUrl: newProfile.avatar_url
          })
          
          console.log("✅ Profile created successfully")
          return
        }
        
        // If multiple profiles exist, this is an error we should clean up
        if (profileExists.length > 1) {
          console.error("❌ Multiple profiles found for this user. This is unexpected.")
          // You could add code here to delete extra profiles if needed
        }
        
        // Now fetch the profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
    
        if (error) {
          console.error("❌ Error fetching profile:", error.message)
        } else {
          setProfileData({
            fullName: data.full_name || "John Doe",
            email: data.email || "john.doe@example.com",
            university: data.university || "Tech University",
            course: data.course || "",
            yearOfJoining: data.year_of_joining || "2021",
            avatarUrl: data.avatar_url || ""
          })
        }
      } catch (err) {
        console.error("❌ Unexpected error:", err)
      }
    }

    fetchProfile()
  }, [user, supabase])

  const handleSaveChanges = async () => {
    if (!user) return
    setLoading(true)

    const updates = {
      full_name: profileData.fullName,
      email: profileData.email,
      university: profileData.university,
      course: profileData.course,
      year_of_joining: profileData.yearOfJoining,
      updated_at: new Date().toISOString(),
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (error) {
        console.error("❌ Error updating profile:", error.message)
      } else {
        console.log("✅ Profile updated successfully")
        setIsEditing(false)
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6 w-full px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 sm:space-x-6 md:space-x-6 w-full sm:w-auto md:w-auto">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {profileData.avatarUrl ? (
                <Image
                  src={profileData.avatarUrl}
                  alt="Avatar"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover rounded-full"
                />
              ) : (
                <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
              )}
            </div>
            <Button size="sm" className="absolute bottom-0 right-0 rounded-full">
              <Upload className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold">{profileData.fullName || "No Name"}</h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{profileData.email || "No Email"}</p>
          </div>
        </div>

        <motion.button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 md:px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg w-full md:w-auto justify-center md:justify-start"
          whileHover="hover"
        >
          Go to Dashboard
          <motion.div
            initial={{ x: 0 }}
            variants={{
              hover: { x: 6 },
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Full Name"
            value={profileData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Input
            id="university"
            placeholder="University"
            value={profileData.university}
            onChange={(e) => handleInputChange("university", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course & Specialization</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={!isEditing}
              >
                {profileData.course
                  ? courseOptions.find((course) => course.value === profileData.course)?.label
                  : "Select course..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <div className="relative">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Search course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-[200px] md:max-h-[300px] overflow-auto p-1">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <div
                      key={course.value}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        profileData.course === course.value ? "bg-accent text-accent-foreground" : ""
                      )}
                      onClick={() => {
                        handleInputChange("course", course.value)
                        setSearchTerm("")
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          profileData.course === course.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {course.label}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm">No course found.</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearOfJoining">Year of Joining</Label>
          <Select
            disabled={!isEditing}
            value={profileData.yearOfJoining}
            onValueChange={(value) => handleInputChange("yearOfJoining", value)}
          >
            <SelectTrigger id="yearOfJoining">
              <SelectValue placeholder="Select year of joining" />
            </SelectTrigger>
            <SelectContent>
              {joinYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="flex gap-4">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 w-full md:w-auto">
            <Pencil className="w-4 h-4" /> Edit Profile
          </Button>
        ) : (
          <Button
            onClick={handleSaveChanges}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
          >
            <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Roadmap Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs md:text-sm font-medium">Overall Progress</span>
                  <span className="text-xs md:text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5 dark:bg-gray-700">
                  <div className="bg-emerald-500 h-2 md:h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}