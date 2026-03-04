

import { Mail, Calendar, Github, Linkedin } from 'lucide-react'

export const dynamic = 'force-static'

export default function ContactPage() {
  return (
    <section
      className="font-mono"
    >
      <div className="mb-4 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h1 className="text-lg font-semibold tracking-tight">
          cat ./contact/info.md
        </h1>
      </div>

      <div className="bg-gray-900 p-3 rounded-md border border-gray-800">
        <p className="text-gray-300 mb-3 text-xs">
          i'm currently available for freelance work, collaborations, and interesting projects. feel free to reach out via email.
        </p>
        
        <div className="space-y-1.5 pt-1 mb-2">
          <p className="flex items-center">
            <Mail className="h-3 w-3 text-amber-400 mr-1.5 flex-shrink-0" />
            <span className="text-gray-300 text-xs">
              <a href="mailto:yigitguldal@gmail.com" className="hover:text-amber-400 transition-colors">yigitguldal@gmail.com</a> (preferred)
            </span>
          </p>
        </div>

        <div className="border-t border-gray-800 pt-3 mt-4">
          <h2 className="text-amber-400 mb-2 text-xs">// social links</h2>
          <div className="space-y-1.5 grid grid-cols-1 sm:grid-cols-2">
            <p className="flex items-center">
              <Github className="h-3 w-3 text-amber-400 mr-1.5 flex-shrink-0" />
              <a href="https://github.com/lordon1a" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-xs hover:text-amber-400 transition-colors">github/lordon1a</a>
            </p>
            <p className="flex items-center">
              <Linkedin className="h-3 w-3 text-amber-400 mr-1.5 flex-shrink-0" />
              <span className="text-gray-300 text-xs">linkedin/yigit-guldal</span>
            </p>
            <p className="flex items-center">
              <Calendar className="h-3 w-3 text-amber-400 mr-1.5 flex-shrink-0" />
              <span className="text-gray-300 text-xs">available for freelance work</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-gray-500 text-[10px] border-t border-gray-800 pt-3">
        <span className="text-amber-400">tip:</span> best way to reach me is through email with a clear subject line.
      </div>
    </section>
  )
} 