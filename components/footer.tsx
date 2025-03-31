import { RiTwitterXFill, RiGithubLine } from "@remixicon/react";
export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://x.com/sandengocka"
          >
            <RiTwitterXFill className="text-xl text-muted hover:text-primary transition-colors duration-300" />
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/sandengocka"
          >
            <RiGithubLine className="text-xl text-muted hover:text-primary transition-colors duration-300" />
          </a>
        </li>
      </ul>
    </footer>
  );
}
