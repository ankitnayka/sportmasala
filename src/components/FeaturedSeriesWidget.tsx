'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FeaturedSeriesWidget() {
    const [activeTab, setActiveTab] = useState<'Test' | 'ODI' | 'T20'>('Test');

    const stats = {
        Test: [
            { label: 'Most Runs', player: 'T. Stubbs', team: 'SA', value: 163 },
            { label: 'Most Wickets', player: 'S. Harmer', team: 'SA', value: 17 },
            { label: 'Most Sixes', player: 'M. Jansen', team: 'SA', value: 8 },
        ],
        ODI: [
            { label: 'Most Runs', player: 'V. Kohli', team: 'IND', value: 245 },
            { label: 'Most Wickets', player: 'J. Bumrah', team: 'IND', value: 11 },
            { label: 'Most Sixes', player: 'R. Sharma', team: 'IND', value: 14 },
        ],
        T20: [
            { label: 'Most Runs', player: 'S. Yadav', team: 'IND', value: 180 },
            { label: 'Most Wickets', player: 'A. Singh', team: 'IND', value: 9 },
            { label: 'Most Sixes', player: 'S. Yadav', team: 'IND', value: 12 },
        ]
    };

    return (
        <div className="bg-[#1e1e1e] rounded-xl border border-zinc-800 overflow-hidden font-sans">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-bold text-base">South Africa tour of India, 2025</h3>
                </div>
                <p className="text-zinc-500 text-xs">14 Nov - 19 Dec</p>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-[#121212]">
                {(['Test', 'ODI', 'T20'] as const).map(format => (
                    <button
                        key={format}
                        onClick={() => setActiveTab(format)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded ${activeTab === format
                                ? 'bg-lime-500 text-black'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            } transition-colors uppercase tracking-wider`}
                    >
                        {format}
                    </button>
                ))}
            </div>

            {/* Stats List */}
            <div className="divide-y divide-zinc-800 bg-[#1e1e1e]">
                {stats[activeTab].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-800/50 transition">
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{stat.player}</span>
                            <span className="text-zinc-500 text-[10px]">{stat.team}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-white font-bold text-lg">{stat.value}</span>
                            <span className="text-zinc-500 text-[10px] uppercase w-16 text-right">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="p-3 grid grid-cols-2 gap-3 border-t border-zinc-800 bg-[#121212]">
                <button className="bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold py-2 rounded border border-zinc-700 hover:border-zinc-500 transition">
                    Event Centre
                </button>
                <button className="bg-transparent text-lime-500 hover:text-lime-400 text-xs font-bold py-2 rounded border border-zinc-700 hover:border-lime-500 transition">
                    Series Stats
                </button>
            </div>

            {/* Pagination / More */}
            <div className="bg-black py-2 flex justify-center items-center gap-2 border-t border-zinc-800 text-zinc-600">
                <div className="h-1.5 w-1.5 rounded-full bg-lime-500"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-700"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-700"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-700"></div>
                <Link href="/schedule" className="ml-2 text-zinc-500 hover:text-white">
                    <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
}
