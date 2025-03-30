import { Award, Calendar, ExternalLink } from "lucide-react"

type License = {
  id: string
  name: string
  issuer: string
  issue_date: string
  expiration_date?: string
  credential_id?: string
  credential_url?: string
}

type LicensesProps = {
  licenses: License[]
}

export default function ResumeLicenses({ licenses }: LicensesProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 print:p-4 print:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xl font-bold">Licenses & Certifications</h2>
      </div>

      <div className="space-y-6 print:space-y-4">
        {licenses.map((license) => (
          <div
            key={license.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-4 last:border-0 last:pb-0"
          >
            <h3 className="font-semibold text-lg">{license.name}</h3>
            <p className="text-gray-700 dark:text-gray-300">{license.issuer}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Issued {formatDate(license.issue_date)}</span>
              </div>

              {license.expiration_date && (
                <div className="flex items-center gap-1">
                  <span>· Expires {formatDate(license.expiration_date)}</span>
                </div>
              )}

              {license.credential_id && (
                <div className="flex items-center gap-1">
                  <span>· Credential ID: {license.credential_id}</span>
                </div>
              )}
            </div>

            {license.credential_url && (
              <a
                href={license.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>See credential</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

