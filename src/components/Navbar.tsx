'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-sidebar border-b border-card-border sticky top-0 z-50 h-16">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">

                    {/* Left: Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-400 hover:text-white focus:outline-none"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>

                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-accent rounded-full p-1">
                                <span className="font-bold text-black text-xs px-1">TM</span>
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">
                                T20<span className="text-accent">Masala</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Top Categories (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-accent text-sm font-bold">Home</Link>
                        <Link href="/cricket" className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm font-medium transition">Cricket</Link>
                        <Link href="/football" className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm font-medium transition">Football</Link>
                        <Link href="/world" className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm font-medium transition">World</Link>
                        <Link href="/politics" className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm font-medium transition">Politics</Link>
                        <Link href="/tennis" className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm font-medium transition">Tennis</Link>
                        <Link href="/wwe" className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm font-medium transition">WWE</Link>
                    </div>

                    {/* Right: Search & Login */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-foreground">
                            <Search className="h-5 w-5" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm hover:text-foreground cursor-pointer px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-500 transition">
                            <span>Eng</span>
                        </div>
                        <ThemeToggle />
                        <Link href="/admin/login" className="text-foreground text-sm font-medium hover:text-accent transition">
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-sidebar border-b border-card-border">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link href="/cricket" className="block px-3 py-2 text-gray-500 dark:text-gray-300 hover:text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md">Cricket</Link>
                        <Link href="/football" className="block px-3 py-2 text-gray-500 dark:text-gray-300 hover:text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md">Football</Link>
                        <Link href="/world" className="block px-3 py-2 text-gray-500 dark:text-gray-300 hover:text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md">World</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
