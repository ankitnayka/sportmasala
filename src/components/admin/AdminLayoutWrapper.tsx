'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
            <AdminSidebar />
            <main className="flex-1 ml-64 min-h-screen p-0">
                {children}
            </main>
        </div>
    );
}
