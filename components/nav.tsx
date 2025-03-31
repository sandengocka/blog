import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
  "https://www.tryearmark.com/": {
    name: "earmark",
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Button
                  key={path}
                  variant="link"
                  size="sm"
                  className="text-md"
                  asChild
                >
                  <Link href={path}>{name}</Link>
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
