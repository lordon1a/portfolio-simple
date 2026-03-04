

import { Code, Globe, Laptop, Terminal } from "lucide-react"

export const dynamic = 'force-static'

export default function SkillsPage() {
  const skills = {
    languages: {
      title: "programming languages",
      icon: "~/bin",
      items: [
        "typescript",
        "javascript",
        "java",
        "python",
        "php",
        "c",
        "go",
        "sql",
        "c#",
        "julia",
      ]
    },
    frontend: {
      title: "technologies",
      icon: "~/usr/src",
      items: [
        "next.js",
        "node.js",
        "react.js",
        "express",
        "ejs",
        "mongodb",
        "mysql",
        "git",
        "postman",
        "redis",
      ]
    },
    tools: {
      title: "tools",
      icon: "~/opt",
      items: [
        "cursor",
        "vs code",
        "visual studio",
        "figma",
        "terminal",
        "notion",
        "docker",
        "nginx",
        "coolify",
        "cloudflare",
        "vps"
      ]
    },
    spoken: {
      title: "spoken languages",
      icon: "~/var/lang",
      items: [
        "turkish (native)",
        "english (fluent)",
        "german (beginner)",
      ]
    },
  }

  return (
    <section 
      className="font-mono"
    >
      <div className="mb-6 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h1 className="text-lg font-semibold tracking-tight">
          ls -la ./skills
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(skills).map(([key, category]) => (
          <div 
            key={key}
            className="bg-gray-900 p-2.5 rounded-md border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center mb-1.5">
              <span className="text-gray-500 mr-1.5 text-xs">{category.icon}</span>
              <h3 className="font-medium text-gray-300 text-xs">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {category.items.map((skill) => (
                <span 
                  key={`${key}-${skill}`}
                  className="text-[10px] bg-gray-800 text-gray-400 px-1 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-gray-500 text-xs border-t border-gray-800 pt-3">
        <p>
          <span className="text-amber-400">note:</span> constantly learning and expanding this list.
        </p>
      </div>
    </section>
  )
} 