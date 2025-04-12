"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, ChevronUp, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/auth/AuthProvider"
import type { Company } from "@/types"
import DashboardHeader from "@/components/dashboard-header"
import CompanyCard from "@/components/company-card"
import RoadmapView from "@/components/roadmap-view"

export default function Roadmap() {
  const { user, loading, supabase } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [salaryRange, setSalaryRange] = useState([0, 100])
  const [dsaLevel, setDsaLevel] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("browse")
  const [isLoading, setIsLoading] = useState(true)

  const domains = Array.from(new Set(companies.map((company) => company.domain)))

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && user.user_metadata?.onboarded !== true) {
      // Be explicit about checking for false/undefined
      router.push("/onboarding");
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching companies...");

        // Change "companies" to "company" to match your actual table name
        const { data, error } = await supabase.from("company").select("*")


        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Failed to load companies",
            description: `Error: ${error.message}`,
            variant: "destructive",
          });
          return;
        }

        console.log("Companies data:", data);
        setCompanies(data as Company[])
        setFilteredCompanies(data as Company[])
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast({
          title: "Failed to load companies",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchCompanies()
    }
  }, [user, toast, supabase])

  useEffect(() => {
    let result = companies

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (company) =>
          company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.position.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply domain filter
    if (selectedDomain) {
      result = result.filter((company) => company.domain === selectedDomain)
    }

    // Apply salary filter
    result = result.filter((company) => {
      const salary = company.ug_compensation
      return salary >= salaryRange[0] && salary <= salaryRange[1]
    })

    // Apply DSA level filter
    if (dsaLevel !== null) {
      result = result.filter((company) => company.dsa_level === dsaLevel)
    }

    setFilteredCompanies(result)
  }, [companies, searchTerm, selectedDomain, salaryRange, dsaLevel])

  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(companyId)) {
        return prev.filter((id) => id !== companyId)
      } else {
        if (prev.length >= 3) {
          toast({
            title: "Maximum selection reached",
            description: "You can select up to 3 companies for roadmap generation",
            variant: "destructive",
          })
          return prev
        }
        return [...prev, companyId]
      }
    })
  }

  const generateRoadmap = async () => {
    if (selectedCompanies.length === 0) {
      toast({
        title: "No companies selected",
        description: "Please select at least one company to generate a roadmap",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, you would call an API to generate the roadmap
      // For now, we'll just switch to the roadmap tab
      setActiveTab("roadmap")

      toast({
        title: "Roadmap generated!",
        description: "Your personalized career roadmap is ready",
      })
    } catch (error) {
      console.error("Error generating roadmap:", error)
      toast({
        title: "Failed to generate roadmap",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="browse">Browse Companies</TabsTrigger>
              <TabsTrigger value="roadmap">Your Roadmap</TabsTrigger>
            </TabsList>

            {activeTab === "browse" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                <Button
                  size="sm"
                  onClick={generateRoadmap}
                  disabled={selectedCompanies.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Generate Roadmap ({selectedCompanies.length}/3)
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search companies or positions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Domain</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedDomain === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedDomain(null)}
                      >
                        All
                      </Badge>
                      {domains.map((domain) => (
                        <Badge
                          key={domain}
                          variant={selectedDomain === domain ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedDomain(domain)}
                        >
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Salary Range (LPA)</h3>
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={5}
                      value={salaryRange}
                      onValueChange={setSalaryRange}
                    />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>₹{salaryRange[0]} LPA</span>
                      <span>₹{salaryRange[1]} LPA</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">DSA Level</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={dsaLevel === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setDsaLevel(null)}
                      >
                        All
                      </Badge>
                      {[1, 2, 3].map((level) => (
                        <Badge
                          key={level}
                          variant={dsaLevel === level ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setDsaLevel(level)}
                        >
                          Level {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedDomain(null)
                      setSalaryRange([0, 100])
                      setDsaLevel(null)
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No companies found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    isSelected={selectedCompanies.includes(company.id)}
                    onToggleSelect={() => toggleCompanySelection(company.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="roadmap">
            <RoadmapView
              selectedCompanyIds={selectedCompanies}
              companies={companies.filter(c => selectedCompanies.includes(c.id))}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
