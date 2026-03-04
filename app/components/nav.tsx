import Link from 'next/link'

const navItems = {
  '/': {
    name: 'about',
  },
  '/projects': {
    name: 'projects',
  },
  '/experience': {
    name: 'experience',
  },
  '/education': {
    name: 'education',
  },
  '/achievements': {
    name: 'achievements',
  },
  '/skills': {
    name: 'skills',
  },
  '/blog': {
    name: 'blog',
  },
  '/contact': {
    name: 'contact',
  },
}

export function Navbar() {
  return (
    <header className="mb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Yiğit Güldal</h1>
        <p className="text-sm text-gray-600">Software Engineer</p>
      </div>
      <nav className="pb-4" id="nav">
        <div className="flex flex-wrap gap-6 border-b border-gray-200 pb-4">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="transition-all hover:text-gray-900 text-gray-600 text-sm capitalize"
            >
              {name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
