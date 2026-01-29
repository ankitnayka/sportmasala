'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar, TrendingUp, Users, LogOut, BookOpen, Camera } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/dashboard', icon: FileText }, // Reusing dashboard for now or split later
    { name: 'Matches', href: '/admin/matches', icon: Calendar },
    { name: 'Web Stories', href: '/admin/web-stories', icon: BookOpen },
    { name: 'Photo Gallery', href: '/admin/gallery', icon: Camera },
    { name: 'Trending Topics', href: '/admin/trending', icon: TrendingUp },
    { name: 'User Management', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-zinc-900 text-white min-h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-zinc-800">
                <span className="text-xl font-bold">T20<span className="text-accent">Masala</span></span>
                <span className="text-xs block text-zinc-500 mt-1">Admin Panel</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-accent text-zinc-900 font-medium'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800">
                {/* Note: Logout logic would go here, usually hitting an API route to clear cookie */}
                <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 w-full rounded-lg transition-colors">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
