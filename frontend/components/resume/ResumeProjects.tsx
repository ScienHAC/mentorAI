import { FolderGit2, Calendar, ExternalLink, Github } from "lucide-react"

type Project = {
  id: string
  name: string
  type: string
  start_date: string
  end_date?: string
  ongoing: boolean
  description?: string
  technologies?: string[]
  repo_url?: string
  demo_url?: string
}

type ProjectsProps = {
  projects: Project[]
}

export default function ResumeProjects({ projects }: ProjectsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 print:p-4 print:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <FolderGit2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h2 className="text-xl font-bold">Projects</h2>
      </div>

      <div className="space-y-6 print:space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-4 last:border-0 last:pb-0"
          >
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-gray-700 dark:text-gray-300">{project.type}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(project.start_date)} - {project.ongoing ? "Present" : formatDate(project.end_date)}
                </span>
              </div>
            </div>

            {project.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-line">{project.description}</p>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-3">
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Github className="w-4 h-4" />
                  <span>Repository</span>
                </a>
              )}

              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

