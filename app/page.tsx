import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Sanden</h1>
      <p className="mb-4">
        Building{" "}
        <a
          href="https://www.tryearmark.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <strong>earmark</strong>
        </a>{" "}
        🚀 Previously Director of Engineering @productplan, led iOS📱@mindbody
        Obsessed with great UX and sharing learnings along the way ❤️
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
