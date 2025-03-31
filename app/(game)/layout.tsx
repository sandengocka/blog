import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Trash Truck Game",
  description: "Side-loader trash truck game",
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative">
      <Button
        variant="link"
        size="sm"
        className="absolute top-4 left-4 text-md"
        asChild
      >
        <Link href="/">home</Link>
      </Button>
      <main className="min-h-screen w-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
