'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

interface TrendingTopic {
    _id: string;
    name: string;
    slug: string;
}

export default function TrendingBar() {
    const [topics, setTopics] = useState<TrendingTopic[]>([]);

    useEffect(() => {
        async function fetchTrending() {
            try {
                // In a real app we might cache this heavily or fetch server side in layout
                const res = await fetch('/api/trending');
                if (res.ok) {
                    const data = await res.json();
                    // Filter active only (if API returns all)
                    setTopics(data.filter((t: any) => t.isActive));
                }
            } catch (e) {
                console.error("Failed to load trending topics");
            }
        }
        fetchTrending();
    }, []);

    if (topics.length === 0) return null;

    return (
        <div className="bg-zinc-900 text-white border-b border-zinc-800">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                <div className="flex items-center h-10 overflow-x-auto no-scrollbar whitespace-nowrap gap-4">
                    <div className="flex items-center gap-1 text-accent font-bold text-xs uppercase tracking-wider shrink-0 bg-zinc-800/50 px-2 py-1 rounded">
                        <Sparkles size={12} />
                        Trending
                    </div>

                    {topics.map((topic) => (
                        <Link
                            key={topic._id}
                            href={`/topic/${topic.slug}`}
                            className="text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-800 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                        >
                            {topic.name}
                        </Link>
                    ))}

                    <Link href="/schedule" className="ml-auto text-xs text-gray-400 hover:text-white flex items-center gap-1 shrink-0">
                        View Schedule <ChevronRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
