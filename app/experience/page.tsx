

import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react"

export const dynamic = 'force-static'

export default function ExperiencePage() {
  const experience = [
    {
      company: "jotform",
      location: "ankara, turkey",
      position: "frontend intern",
      period: "aug 2025 - sep 2025",
      description: [
        "accepted an offer to join the frontend development team to contribute to jotform's innovative form-building solutions.",
      ],
    },
    {
      company: "cankaya university",
      location: "ankara, turkey",
      position: "undergraduate teaching assistant",
      period: "nov 2024 - june 2025",
      description: [
        "assisting in seng271 (software project i), seng101 (computer programming i), seng102 (computer programming ii), seng272 (software project ii) and seng384 (software project iv) courses.",
        "supporting students with programming concepts, reviewing assignments, and providing guidance in software development projects.",
      ],
    },
    {
      company: "tourist: travel the world",
      location: "remote",
      position: "web development intern",
      period: "july 2024 - nov 2024",
      description: [
        "collaborated with the development team to design and implement new features for the company's ai-powered travel planning platform.",
        "worked with web development technologies and contributed to both frontend and backend development tasks.",
        "implemented ci/cd pipelines, managed containerized deployments, and optimized development workflows.",
      ],
    },
    {
      company: "google game and application academy",
      location: "istanbul, turkey",
      position: "trainee",
      period: "nov 2023 - july 2024",
      description: [
        "participated in a rigorous training program focused on game and application development using industry-standard tools and practices.",
        "collaborated on team projects, enhancing skills in software design, coding, and project management in a professional setting.",
        "engaged in hands-on learning and developed proficiency in modern development environments.",
      ],
    },
    {
      company: "g.round",
      location: "remote",
      position: "quality assurance tester",
      period: "may 2023 - nov 2023",
      description: [
        "conducted comprehensive game testing, prepared detailed reports, and analyzed software quality through systematic evaluation.",
        "evaluated game sections individually, provided ratings, and analyzed user experience and playability levels.",
        "documented bugs with detailed reproduction steps and suggested solutions for improvement.",
      ],
    },
  ];

  return (
    <section 
      className="font-mono"
    >
      <div className="mb-6 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h1 className="text-lg font-semibold tracking-tight">
          cat ./experience/timeline.md
        </h1>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div 
            key={exp.company + exp.position}
            className="bg-gray-900 p-3 rounded-md border border-gray-800"
          >
            <div className="mb-1.5">
              <h3 className="font-medium text-gray-300 flex items-center text-sm">
                <Briefcase className="h-3.5 w-3.5 text-amber-400 mr-1.5" />
                {exp.company}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">{exp.position}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-1.5 text-xs text-gray-500">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {exp.period}
              </span>
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {exp.location}
              </span>
            </div>
            
            <ul className="space-y-1">
              {exp.description.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-400 flex">
                  <ChevronRight className="h-2.5 w-2.5 text-amber-400 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 text-gray-500 text-xs border-t border-gray-800 pt-4">
        <span className="text-amber-400">tip:</span> working on diverse projects helps you grow faster as a developer.
      </div>
    </section>
  )
} 