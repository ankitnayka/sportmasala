import Navbar from "@/components/Navbar";
import TrendingBar from "@/components/TrendingBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50">
        <Navbar />
        <TrendingBar />
      </div>
      <div className="max-w-[1440px] mx-auto flex pt-4 px-4 sm:px-6">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
