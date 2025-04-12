"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  Code,
  BookOpen,
  CheckCircle,
  Shield,
  Palette,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/auth/AuthProvider"

const domains = [
  { id: "software-engineering", name: "Software Engineering", icon: <Code className="h-6 w-6" /> },
  { id: "data-science", name: "Data Science", icon: <BookOpen className="h-6 w-6" /> },
  { id: "cybersecurity", name: "Cybersecurity", icon: <Shield className="h-6 w-6" /> },
  { id: "product-management", name: "Product Management", icon: <Briefcase className="h-6 w-6" /> },
  { id: "ui-ux", name: "UI/UX Design", icon: <Palette className="h-6 w-6" /> },
  { id: "devops", name: "DevOps", icon: <Settings className="h-6 w-6" /> },
]

export default function Onboarding() {
  const { user, loading, supabase } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    careerGoal: "",
    experienceLevel: "beginner",
    preferredDomains: [] as string[],
  })

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    } else if (user?.user_metadata?.onboarded === true) {
      // Be explicit about checking for true
      router.push("/roadmap");
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || "",
      }));
    }
  }, [user, router, loading]);

  const handleNext = () => {
    if (step === 0 && !formData.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name to continue",
        variant: "destructive",
      })
      return
    }

    if (step === 1 && !formData.careerGoal.trim()) {
      toast({
        title: "Career goal is required",
        description: "Please enter your career goal to continue",
        variant: "destructive",
      })
      return
    }

    if (step === 3 && formData.preferredDomains.length === 0) {
      toast({
        title: "Domain selection is required",
        description: "Please select at least one domain to continue",
        variant: "destructive",
      })
      return
    }

    if (step < 4) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const toggleDomain = (domainId: string) => {
    setFormData((prev) => {
      if (prev.preferredDomains.includes(domainId)) {
        return {
          ...prev,
          preferredDomains: prev.preferredDomains.filter((id) => id !== domainId),
        }
      } else {
        return {
          ...prev,
          preferredDomains: [...prev.preferredDomains, domainId],
        }
      }
    })
  }

  const completeOnboarding = async () => {
    if (!user) return

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          career_goal: formData.careerGoal,
          experience_level: formData.experienceLevel,
          preferred_domains: formData.preferredDomains,
          onboarded: true,
        }
      })

      if (error) throw error

      toast({
        title: "Onboarding complete!",
        description: "Welcome to your personalized career dashboard",
      })

      router.push("/profile")
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Let's Get Started</h1>
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${step >= i ? "bg-purple-500" : "bg-slate-200 dark:bg-slate-700"}`}
              ></div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px] flex flex-col"
          >
            {step === 0 && (
              <div className="flex-1">
                <div className="mb-8 flex items-center space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                    <User className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Tell us about yourself</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">What's your name?</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex-1">
                <div className="mb-8 flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Your career goals</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="careerGoal">What's your career goal?</Label>
                    <Textarea
                      id="careerGoal"
                      placeholder="e.g., I want to become a senior software engineer at a FAANG company within 2 years"
                      value={formData.careerGoal}
                      onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1">
                <div className="mb-8 flex items-center space-x-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <Code className="h-6 w-6 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Your experience level</h2>
                </div>

                <div className="space-y-6">
                  <RadioGroup
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                        <div className="font-medium">Beginner</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          I'm just starting out or have less than 1 year of experience
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                        <div className="font-medium">Intermediate</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          I have 1-3 years of experience in the tech industry
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                        <div className="font-medium">Advanced</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          I have 3+ years of experience and am looking to level up
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1">
                <div className="mb-8 flex items-center space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Your preferred domains</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Select the domains you're interested in (select at least one)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {domains.map((domain) => (
                      <div
                        key={domain.id}
                        className={`border p-4 rounded-lg cursor-pointer transition-all ${formData.preferredDomains.includes(domain.id)
                          ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        onClick={() => toggleDomain(domain.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${formData.preferredDomains.includes(domain.id)
                              ? "bg-purple-100 dark:bg-purple-800"
                              : "bg-slate-100 dark:bg-slate-800"
                              }`}
                          >
                            {domain.icon}
                          </div>
                          <div className="font-medium">{domain.name}</div>
                          {formData.preferredDomains.includes(domain.id) && (
                            <CheckCircle className="h-5 w-5 text-purple-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-8">
                  <div className="mx-auto bg-green-100 dark:bg-green-900 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md">
                    We've gathered all the information we need to create your personalized career roadmap.
                  </p>
                </div>

                <div className="space-y-4 w-full max-w-md">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="font-medium mb-1">Name</div>
                    <div className="text-slate-600 dark:text-slate-300">{formData.name}</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="font-medium mb-1">Career Goal</div>
                    <div className="text-slate-600 dark:text-slate-300">{formData.careerGoal}</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="font-medium mb-1">Experience Level</div>
                    <div className="text-slate-600 dark:text-slate-300 capitalize">{formData.experienceLevel}</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="font-medium mb-1">Preferred Domains</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      {formData.preferredDomains.map((id) => domains.find((d) => d.id === id)?.name).join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className={step === 0 ? "opacity-0" : ""}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button onClick={handleNext}>
            {step < 4 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Complete Onboarding"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
