import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex pt-0">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
