import Image from "next/image"
import { User, MapPin, Mail, Link2 } from "lucide-react"

type ProfileProps = {
  profile: {
    id: string
    full_name: string
    email: string
    university?: string
    course?: string
    year_of_joining?: string
    avatar_url?: string
    location?: string
    bio?: string
    website?: string
  }
}

export default function ResumeHeader({ profile }: ProfileProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 print:p-4 print:shadow-none">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url || "/placeholder.svg"}
              alt={profile.full_name || "User Avatar"}
              fill
              sizes="(max-width: 768px) 96px, 128px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{profile.full_name}</h1>

          {profile.course && <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{profile.course}</p>}

          <div className="mt-3 space-y-2">
            {profile.university && profile.year_of_joining && (
              <p className="text-gray-600 dark:text-gray-400">
                {profile.university} (Since {profile.year_of_joining})
              </p>
            )}

            {profile.location && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>

            {profile.website && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Link2 className="w-4 h-4" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>

          {profile.bio && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

