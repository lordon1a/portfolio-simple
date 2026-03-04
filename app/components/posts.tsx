import Link from "next/link";
import { getBlogPosts, formatDate } from "app/blog/utils";

export async function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="space-y-4">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .slice(0, 3)
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                {post.metadata.title}
              </h3>
              <span className="text-sm text-gray-500">
                {formatDate(post.metadata.publishedAt, false)}
              </span>
            </div>
            {post.metadata.summary && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.metadata.summary}
              </p>
            )}
          </Link>
        ))}
    </div>
  )
}
