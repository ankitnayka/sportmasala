'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Image as ImageIcon, BookOpen, BarChart2, Smartphone } from 'lucide-react';

const menuItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Schedule', icon: Calendar, href: '/schedule' },
    { name: 'Photo Gallery', icon: ImageIcon, href: '/photos' },
    { name: 'Web Stories', icon: BookOpen, href: '/stories' },
    { name: 'Polls', icon: BarChart2, href: '/polls' },
    { name: 'Automation', icon: Smartphone, href: '/admin/automation' }, // Admin only technically, but added here for specific user request flow
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-sidebar border-r border-card-border hidden lg:flex flex-col overflow-y-auto">
            <div className="flex-1 py-6">
                <nav className="space-y-1 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors
                  ${isActive
                                        ? 'bg-gray-200 dark:bg-zinc-800 text-accent border-l-4 border-accent'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-foreground'}
                `}
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* App Download CTA */}
            <div className="p-4 border-t border-gray-800">
                <div className="bg-gradient-to-br from-zinc-800 to-black p-4 rounded-xl relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center"></div>
                    <div className="relative z-10">
                        <Smartphone className="h-8 w-8 text-lime-400 mb-2" />
                        <p className="text-white text-xs font-bold mb-1">Download App</p>
                        <p className="text-gray-400 text-[10px]">Get live scores on the go</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
