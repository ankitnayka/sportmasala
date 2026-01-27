'use client';

import { useState, useEffect } from 'react';
import AdPlaceholder from "@/components/AdPlaceholder";
import { Calendar, MapPin, Clock } from 'lucide-react';

type SportType = 'Cricket' | 'Football' | 'Other';

interface Match {
    _id: string;
    sport: SportType;
    series: string;
    team1: string;
    team2: string;
    date: string;
    time: string; // derived from date
    venue: string;
    status: string;
    team1Score?: string;
    team2Score?: string;
    result?: string;
}

export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState<SportType>('Cricket');
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/matches?sport=${activeTab}`)
            .then(res => res.json())
            .then(data => {
                setMatches(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch matches', err);
                setLoading(false);
            });
    }, [activeTab]);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#121212] min-h-screen text-white">
            <AdPlaceholder slot="header" className="mb-8" />

            <div className="flex items-center gap-3 mb-8">
                <Calendar className="h-8 w-8 text-lime-500" />
                <h1 className="text-3xl font-bold uppercase tracking-wide">Sports Schedule</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-8 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('Cricket')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition whitespace-nowrap
                ${activeTab === 'Cricket' ? 'text-black bg-lime-500 rounded-t-lg' : 'text-gray-400 hover:text-white'}
            `}
                >
                    Cricket (T20 WC)
                </button>
                <button
                    onClick={() => setActiveTab('Football')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition whitespace-nowrap
                ${activeTab === 'Football' ? 'text-black bg-lime-500 rounded-t-lg' : 'text-gray-400 hover:text-white'}
            `}
                >
                    Football
                </button>
                <button
                    onClick={() => setActiveTab('Other')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition whitespace-nowrap
                ${activeTab === 'Other' ? 'text-black bg-lime-500 rounded-t-lg' : 'text-gray-400 hover:text-white'}
            `}
                >
                    Other Sports
                </button>
            </div>

            {/* Schedule List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading schedule...</div>
                ) : (
                    matches.map((item) => (
                        <div key={item._id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:bg-[#252525] transition group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <span className="inline-block px-2 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold uppercase rounded mb-2 border border-gray-700">
                                        {item.series}
                                    </span>
                                    <div className="mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition inline-block mr-2">
                                            {item.team1} vs {item.team2}
                                        </h3>
                                        {(item.team1Score || item.team2Score) && (
                                            <div className="text-sm font-mono text-lime-500 mt-1">
                                                {item.team1Score} {item.team2Score ? `vs ${item.team2Score}` : ''}
                                            </div>
                                        )}
                                    </div>

                                    {item.result && (
                                        <p className="text-xs text-lime-400 font-bold mb-3 uppercase">{item.result}</p>
                                    )}

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-lime-600" />
                                            <span>{new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-lime-600" />
                                            <span>{new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4 text-lime-600" />
                                            <span>{item.venue}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:text-right">
                                    <span className={`inline-block px-4 py-2 border text-xs font-bold rounded-lg whitespace-nowrap
                                ${item.status === 'Live' ? 'bg-red-900/20 border-red-500 text-red-500 animate-pulse' :
                                            item.status === 'Ended' ? 'bg-gray-800 border-gray-600 text-gray-400' :
                                                'bg-gray-900 border-gray-700 text-gray-300'}
                            `}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {!loading && matches.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-[#1e1e1e] rounded-xl border border-gray-800">
                        No scheduled matches found for {activeTab}.
                        <br />
                        <span className="text-xs mt-2 block">Check back later or add via Admin Panel.</span>
                    </div>
                )}
            </div>

            <AdPlaceholder slot="footer" className="mt-12" />
        </div>
    );
}
