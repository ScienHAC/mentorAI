"use client"

import { motion } from "framer-motion"
import { Star, StarHalf, DollarSign, Code, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Company } from "@/types"

interface CompanyCardProps {
  company: Company
  isSelected: boolean
  onToggleSelect: () => void
}

export default function CompanyCard({ company, isSelected, onToggleSelect }: CompanyCardProps) {
  const getDsaStars = (level: number) => {
    switch (level) {
      case 1:
        return (
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <StarHalf className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            <StarHalf className="h-4 w-4 text-slate-300 dark:text-slate-600" />
          </div>
        )
      case 2:
        return (
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <StarHalf className="h-4 w-4 text-slate-300 dark:text-slate-600" />
          </div>
        )
      case 3:
        return (
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          </div>
        )
      default:
        return (
          <div className="flex items-center">
            <StarHalf className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            <StarHalf className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            <StarHalf className="h-4 w-4 text-slate-300 dark:text-slate-600" />
          </div>
        )
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
      <Card
        className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-purple-500 dark:ring-purple-400" : ""}`}
      >
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg line-clamp-1">{company.company_name}</h3>
              <Badge variant="outline" className="ml-2 shrink-0">
                {company.domain}
              </Badge>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-1">{company.position}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                  <DollarSign className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="text-sm">₹{company.ug_compensation} LPA</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full">
                  <Code className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="text-sm">DSA: {getDsaStars(company.dsa_level)}</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-1">
                {Object.entries(company.coding_languages)
                  .slice(0, 3)
                  .map(([lang, level]) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}: {level}
                    </Badge>
                  ))}
                {Object.keys(company.coding_languages).length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{Object.keys(company.coding_languages).length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="border-t p-4">
            <Button
              onClick={onToggleSelect}
              variant={isSelected ? "default" : "outline"}
              className={`w-full ${
                isSelected
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "hover:bg-purple-50 hover:text-purple-500 dark:hover:bg-purple-900/20"
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Selected
                </>
              ) : (
                "Select for Roadmap"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
