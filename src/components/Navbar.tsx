'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SidebarMobileTrigger from './SidebarMobileTrigger';

const categories = [
    { name: 'Home', href: '/' },
    { name: 'Cricket', href: '/cricket' },
    { name: 'Football', href: '/football' },
    { name: 'Tennis', href: '/tennis' },
    { name: 'Basketball', href: '/basketball' },
    { name: 'Motor Sports', href: '/motor-sports' },
    { name: 'WWE', href: '/wwe' },
    { name: 'Hockey', href: '/hockey' },
    { name: 'American Football', href: '/american-football' },
];

export default function Navbar() {
    return (
        <nav className="bg-black border-b border-zinc-800 relative z-50">
            {/* Top Row: Logo, Search, Login */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                {/* Left: Hamburger (Mobile) & Logo */}
                <div className="flex items-center gap-4">
                    <SidebarMobileTrigger />

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-lime-500 rounded-lg p-1 group-hover:bg-lime-400 transition">
                            <span className="font-black text-black text-xs px-1">TM</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            SPORTS <span className="text-lime-500">Tak</span> Clone
                        </span>
                    </Link>
                </div>

                {/* Center: Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-1 overflow-x-auto no-scrollbar mask-gradient px-4 max-w-2xl">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors whitespace-nowrap"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Right: Tools */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white">
                        <Search className="h-5 w-5" />
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-gray-400 text-xs font-bold hover:text-white cursor-pointer border border-zinc-700 rounded-full px-3 py-1.5 bg-zinc-900">
                        <span>Eng</span>
                    </div>
                    {/* ThemeToggle hidden as we force dark mode for this specific 'clone' look? Or keep it? User said 'exact layout', layout implies visual style. Keeping it but styling it subtly */}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                    <Link href="/admin/login" className="text-white text-xs font-bold bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors border border-zinc-700">
                        Login
                    </Link>
                </div>
            </div>

            {/* Mobile/Tablet Category Bar (Horizontal Scroll) */}
            <div className="lg:hidden border-t border-zinc-800 overflow-x-auto no-scrollbar bg-[#121212]">
                <div className="flex items-center h-10 px-4 space-x-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="text-gray-400 hover:text-white text-xs font-bold uppercase whitespace-nowrap"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
