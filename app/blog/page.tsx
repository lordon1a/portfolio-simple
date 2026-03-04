

import { getBlogPosts } from './utils'
import Link from 'next/link'
import { formatDate } from './utils'
import { CalendarIcon } from 'lucide-react'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <section 
      className="font-mono"
    >
      <div className="mb-6 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h1 className="text-lg font-semibold tracking-tight">
          ls -la ./blog
        </h1>
      </div>

      <div className="space-y-4">
        {posts
          .sort((a, b) => {
            if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
              return -1
            }
            return 1
          })
          .map((post) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-gray-900 p-3 rounded-md border border-gray-800 hover:border-gray-700 transition-all block"
            >
              <div className="flex justify-between items-start mb-1.5">
                <h2 className="font-medium text-gray-300 text-sm">{post.metadata.title}</h2>
                <div className="flex items-center text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                  <CalendarIcon className="h-2.5 w-2.5 mr-1" />
                  <span>{formatDate(post.metadata.publishedAt, false)}</span>
                </div>
              </div>
              
              {post.metadata.summary && (
                <p className="text-gray-400 text-xs leading-snug">
                  {post.metadata.summary}
                </p>
              )}
            </Link>
          ))}
      </div>

      {posts.length === 0 && (
        <div className="bg-gray-900 p-3 rounded-md border border-gray-800">
          <p className="text-gray-400 text-xs">no posts yet. check back soon.</p>
        </div>
      )}

      <div className="mt-6 text-gray-500 text-xs border-t border-gray-800 pt-4">
        <p>
          <span className="text-amber-400">tip:</span> subscribe to the <Link href="/rss" className="text-amber-400 hover:underline">rss feed</Link> to stay updated.
        </p>
      </div>
    </section>
  )
}
