import { GraduationCap, Calendar } from "lucide-react"

type Education = {
  id: string
  school: string
  degree: string
  field_of_study: string
  location?: string
  start_date: string
  end_date?: string
  grade?: string
  activities?: string
  description?: string
}

type EducationProps = {
  education: Education[]
}

export default function ResumeEducation({ education }: EducationProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 print:p-4 print:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold">Education</h2>
      </div>

      <div className="space-y-6 print:space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-4 last:border-0 last:pb-0"
          >
            <h3 className="font-semibold text-lg">{edu.school}</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {edu.degree}, {edu.field_of_study}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </span>
              </div>

              {edu.location && (
                <div className="flex items-center gap-1">
                  <span>· {edu.location}</span>
                </div>
              )}

              {edu.grade && (
                <div className="flex items-center gap-1">
                  <span>· Grade: {edu.grade}</span>
                </div>
              )}
            </div>

            {edu.activities && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Activities: {edu.activities}</p>
            )}

            {edu.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-line">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

