import { BlogPosts } from "@/components/posts";

export default function Page() {
  return (
    <section>
      <div className="flex flex-col space-y-6">
        <header className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter">Sanden</h1>
          <div className="flex flex-col space-y-3 text-neutral-800 dark:text-neutral-200">
            <p className="flex items-center">
              <span className="mr-2">🚀</span>
              Building{" "}
              <a
                href="https://www.tryearmark.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                earmark
              </a>
            </p>
            <p className="flex items-center">
              <span className="mr-2">👨‍💻</span>
              Previously Director of Engineering @productplan
            </p>
            <p className="flex items-center">
              <span className="mr-2">📱</span>
              Led iOS @mindbody
            </p>
            <p className="mt-2">
              Obsessed with great UX and sharing learnings along the way ❤️
            </p>
          </div>
        </header>

        <div className="pt-4">
          <BlogPosts />
        </div>
      </div>
    </section>
  );
}
