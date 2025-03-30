import { Briefcase, Calendar } from "lucide-react"

type Experience = {
  id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description?: string
}

type ExperienceProps = {
  experiences: Experience[]
}

export default function ResumeExperience({ experiences }: ExperienceProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 print:p-4 print:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold">Experience</h2>
      </div>

      <div className="space-y-6 print:space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-4 last:border-0 last:pb-0"
          >
            <h3 className="font-semibold text-lg">{exp.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{exp.company}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(exp.start_date)} - {exp.current ? "Present" : formatDate(exp.end_date)}
                </span>
              </div>

              {exp.location && (
                <div className="flex items-center gap-1">
                  <span>· {exp.location}</span>
                </div>
              )}
            </div>

            {exp.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-line">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

