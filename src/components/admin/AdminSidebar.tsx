'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar, TrendingUp, Users, LogOut, BookOpen, Camera, BarChart2, Video } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/dashboard', icon: FileText }, // Reusing dashboard for now or split later
    { name: 'Matches', href: '/admin/matches', icon: Calendar },
    { name: 'Web Stories', href: '/admin/web-stories', icon: BookOpen },
    { name: 'Photo Gallery', href: '/admin/gallery', icon: Camera },
    { name: 'Polls', href: '/admin/polls', icon: BarChart2 },
    { name: 'Featured Video', href: '/admin/featured-video', icon: Video },
    { name: 'Trending Topics', href: '/admin/trending', icon: TrendingUp },
    { name: 'User Management', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = require('next/navigation').useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside className="w-64 bg-zinc-900 text-white min-h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-zinc-800">
                <span className="text-xl font-bold">T20<span className="text-accent">Masala</span></span>
                <span className="text-xs block text-zinc-500 mt-1">Admin Panel</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 space-y-2">
                <ThemeToggle />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 w-full rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
