import Link from "next/link";
import { formatDate, getBlogPosts } from "@/app/(main)/blog/utils";

// Add an array of blog slugs to hide
const hiddenPosts: string[] = [
  // Add slugs of posts you want to hide, for example:
  "vim",
  "spaces-vs-tabs",
  "static-typing",
];

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div>
      {allBlogs
        .filter((post) => !hiddenPosts.includes(post.slug))
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={
              post.slug === "trash-truck-game"
                ? "/trash-truck-game"
                : `/blog/${post.slug}`
            }
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] whitespace-nowrap tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
