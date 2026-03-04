import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="font-mono flex flex-col items-start space-y-6">
      <div className="bg-gray-900 p-4 w-full rounded-md border border-gray-800">
        <div className="text-red-500 mb-3">
          <span>error: command not found (404)</span>
        </div>
        <div className="text-gray-400 mb-4">
          <p className="mb-1">the requested resource could not be found.</p>
          <p className="text-gray-500 text-sm">// use one of the commands below</p>
        </div>
        <div className="space-y-2 text-gray-200">
          <div className="flex items-start">
            <span className="text-green-500 mr-2">$</span>
            <Link href="/" className="hover:text-green-500 transition-colors">
              cd /home
            </Link>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">$</span>
            <Link href="/blog" className="hover:text-green-500 transition-colors">
              ls ./blog
            </Link>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">$</span>
            <Link href="/projects" className="hover:text-green-500 transition-colors">
              find ./projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
