"use client"

import { useState, useEffect } from 'react'
import { Github, Star, Mail, Linkedin } from 'lucide-react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('about')
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [skills, setSkills] = useState([])
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to load projects:', err))

    fetch('/api/experience')
      .then(res => res.json())
      .then(data => setExperience(data))
      .catch(err => console.error('Failed to load experience:', err))

    fetch('/api/education')
      .then(res => res.json())
      .then(data => setEducation(data))
      .catch(err => console.error('Failed to load education:', err))

    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Failed to load skills:', err))

    fetch('/api/achievements')
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(err => console.error('Failed to load achievements:', err))
  }, [])

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <section className="bg-primary min-h-screen -mt-6 -mx-2 md:-mx-0 px-2 md:px-0 flex flex-col">
      <div className="max-w-2xl mx-auto pt-12 flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-[2.1rem] leading-tight font-semibold tracking-tight text-gray-100">Yiğit Güldal</h1>
            <p className="text-sm tracking-wide text-gray-400">Software Developer</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => {
                const html = document.documentElement
                html.classList.toggle('light')
                html.style.colorScheme = html.classList.contains('light') ? 'light' : 'dark'
              }}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <a
              href="https://github.com/lordon1a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mb-8 border-b border-gray-700">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer transition-all text-sm capitalize ${
                  activeTab === tab.id
                    ? 'text-gray-100 border-b-2 border-gray-100 pb-3 -mb-px'
                    : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent pb-3 -mb-px'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content with slide animation */}
        <div className="relative overflow-hidden flex-1">
          <div
            className={`transition-all duration-300 ease-in-out h-full ${
              activeTab === 'about' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <AboutContent />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out h-full ${
              activeTab === 'projects' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <ProjectsContent projects={projects} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'experience' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <ExperienceContent experience={experience} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'education' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <EducationContent education={education} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'achievements' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <AchievementsContent achievements={achievements} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'skills' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <SkillsContent skills={skills} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'contact' ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-4 pointer-events-none'
            }`}
          >
            <ContactContent />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 mb-10 pt-8 border-t border-gray-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400">
            <p>© 2025 yigit guldal</p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/lordon1a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:yigitguldal@gmail.com" 
                className="hover:text-gray-200 transition-colors flex items-center gap-1"
              >
                yigitguldal@gmail.com
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}

function AboutContent() {
  return (
    <div>
      <div className="mb-12">
        <p className="text-gray-300 mb-4 leading-relaxed">
          I'm Yiğit — an Economics student and passionate software developer who builds modern web applications. I enjoy turning complex problems into simple, beautiful, and scalable solutions.
        </p>
        <p className="text-gray-400 text-sm">
          Passionate about creating innovative solutions.
        </p>
      </div>

    </div>
  )
}

function ProjectsContent({ projects }: { projects: any[] }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-100">Projects</h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-secondary p-3 rounded-md border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-gray-300 text-sm">{project.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-xs bg-gray-800 text-amber-400 px-2 py-0.5 rounded">
                    <Star className="h-3 w-3 mr-1" />
                    {project.stars || 0}
                  </span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                    {project.year || '-'}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mb-2 leading-relaxed">
                {project.description || 'No description available.'}
              </p>
              <div className="flex justify-between items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {(project.tags || []).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ExperienceContent({ experience }: { experience: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-100 mb-6">Experience</h2>
      {experience.length === 0 ? (
        <p className="text-gray-400">No experience added yet.</p>
      ) : (
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp.id} className="border-l-2 border-gray-700 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-200">{exp.position}</h3>
                  <p className="text-sm text-gray-400">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-400 mb-2">{exp.description}</p>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech: string, idx: number) => (
                    <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EducationContent({ education }: { education: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-100 mb-6">Education</h2>
      {education.length === 0 ? (
        <p className="text-gray-400">No education added yet.</p>
      ) : (
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-gray-700 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-200">{edu.degree}</h3>
                  <p className="text-sm text-gray-400">{edu.school}</p>
                  {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
                </div>
                <span className="text-xs text-gray-500">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </span>
              </div>
              {edu.description && (
                <p className="text-sm text-gray-400">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AchievementsContent({ achievements }: { achievements: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-100 mb-6">Achievements</h2>
      {achievements.length === 0 ? (
        <p className="text-gray-400">No achievements added yet.</p>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border-l-2 border-gray-700 pl-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-gray-200">{achievement.title}</h3>
                <span className="text-xs text-gray-500">{achievement.date}</span>
              </div>
              {achievement.organization && (
                <p className="text-sm text-gray-400 mb-1">{achievement.organization}</p>
              )}
              {achievement.description && (
                <p className="text-sm text-gray-500">{achievement.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SkillsContent({ skills }: { skills: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-100 mb-6">Skills</h2>
      {skills.length === 0 ? (
        <p className="text-gray-400">No skills added yet.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(
            skills.reduce((acc: any, skill) => {
              const category = skill.category || 'Other'
              if (!acc[category]) acc[category] = []
              acc[category].push(skill)
              return acc
            }, {})
          ).map(([category, categorySkills]: [string, any]) => (
            <div key={category}>
              <h3 className="font-medium text-gray-200 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="text-sm bg-gray-800 text-gray-300 px-3 py-1.5 rounded"
                  >
                    {skill.name}
                    {skill.level && <span className="text-gray-500 ml-2">• {skill.level}</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactContent() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-100 mb-6">Contact</h2>
      <div className="space-y-4">
        <p className="text-gray-400 text-sm">
          Available for freelance work, collaborations, and product-focused engineering roles.
        </p>

        <div className="space-y-3">
          <a
            href="mailto:yigitguldal@gmail.com"
            className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors"
          >
            <Mail className="h-4 w-4" />
            yigitguldal@gmail.com
          </a>

          <a
            href="https://github.com/lordon1a"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors"
          >
            <Github className="h-4 w-4" />
            github.com/lordon1a
          </a>

          <a
            href="https://www.linkedin.com/in/yi%C4%9Fit-g-57b659289/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            linkedin.com/in/yiğit-g
          </a>
        </div>
      </div>
    </div>
  )
}
