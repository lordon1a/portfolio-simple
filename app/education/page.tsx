
import { GraduationCap, Calendar, MapPin } from "lucide-react"

export const dynamic = 'force-static'

export default function EducationPage() {
  const education = [
    {
      school: "cankaya university",
      location: "ankara, turkey",
      degree: "bachelor of engineering in software",
      period: "oct. 2022 - june 2026 (expected)",
      gpa: "gpa: 3.32",
      description: "focused on software development and computer science fundamentals.",
    },
    {
      school: "icel anatolian highschool",
      location: "mersin, turkey",
      degree: "high school diploma",
      period: "sep. 2017 - june 2021",
      gpa: "gpa: 3.74 (92.6/100.0)",
      description: "graduated with honors.",
    },
  ];

  return (
    <section 
      className="font-mono"
    >
      <div className="mb-6 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h1 className="text-lg font-semibold tracking-tight">
          cat ./education/history.md
        </h1>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div 
            key={edu.school}
            className="bg-gray-900 p-3 rounded-md border border-gray-800 relative"
          >
            <div className="mb-1.5">
              <h3 className="font-medium text-gray-300 flex items-center text-sm">
                <GraduationCap className="h-3.5 w-3.5 text-amber-400 mr-1.5" />
                {edu.school}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">{edu.degree}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-1.5 text-xs text-gray-500">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {edu.period}
              </span>
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {edu.location}
              </span>
            </div>
            
            <p className="text-xs text-amber-400 mb-1.5">{edu.gpa}</p>
            
            <p className="text-xs text-gray-400">
              {edu.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-gray-500 text-xs border-t border-gray-800 pt-4">
        <span className="text-amber-400">note:</span> education is a continuous journey, always learning and improving.
      </div>
    </section>
  )
} 