import { Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 mb-10 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>© 2026 yigit guldal</p>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/lordon1a" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href="mailto:yigitguldal@gmail.com" 
            className="hover:text-gray-900 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
