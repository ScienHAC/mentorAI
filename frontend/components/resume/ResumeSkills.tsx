type Skill = {
  id: string
  name: string
  level: number
  verified: boolean
}

type SkillsProps = {
  skills: Skill[]
}

export default function ResumeSkills({ skills }: SkillsProps) {
  // Group skills by proficiency level
  const expertSkills = skills.filter((skill) => skill.level >= 80)
  const advancedSkills = skills.filter((skill) => skill.level >= 60 && skill.level < 80)
  const intermediateSkills = skills.filter((skill) => skill.level >= 40 && skill.level < 60)
  const beginnerSkills = skills.filter((skill) => skill.level < 40)

  const skillGroups = [
    { title: "Expert", skills: expertSkills },
    { title: "Advanced", skills: advancedSkills },
    { title: "Intermediate", skills: intermediateSkills },
    { title: "Beginner", skills: beginnerSkills },
  ].filter((group) => group.skills.length > 0)

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 print:p-4 print:shadow-none">
      <h2 className="text-xl font-bold mb-4">Skills</h2>

      <div className="space-y-4">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    skill.verified
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {skill.name}
                  {skill.verified && <span className="ml-1 text-xs">✓</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

