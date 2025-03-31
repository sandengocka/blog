import Footer from "@/components/footer";
import { Navbar } from "@/components/nav";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-auto min-w-0 mt-8 flex flex-col px-2 md:px-0 max-w-xl mx-4 lg:mx-auto">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
