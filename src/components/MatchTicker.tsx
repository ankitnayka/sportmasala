'use client';

import { ChevronRight } from "lucide-react";

// Mock data for ticker
const matches = [
    { id: 1, league: 'WPL 2026', team1: 'GG', team1Score: '174/9 (20.0)', team2: 'DC', team2Score: '171/8 (20.0)', status: 'ENDED', result: 'GG won by 3 runs' },
    { id: 2, league: 'U-19 WC', team1: 'IND', team1Score: '352/8 (50.0)', team2: 'ZIM', team2Score: '148/10 (37.4)', status: 'ENDED', result: 'India won by 204 runs' },
    { id: 3, league: 'NZ tour of IND', team1: 'IND', team1Score: '180/4 (18.2)', team2: 'NZ', team2Score: '178/7 (20.0)', status: 'LIVE', result: 'India need 2 runs' },
    { id: 4, league: 'IPL 2026', team1: 'CSK', team1Score: '210/4', team2: 'MI', team2Score: '-', status: 'UPCOMING', result: 'Starts at 7:30 PM' },
];

export default function MatchTicker() {
    return (
        <div className="bg-[#121212] border-b border-gray-800 py-4 overflow-x-auto no-scrollbar">
            <div className="flex space-x-4 px-4 min-w-max">
                {matches.map((match) => (
                    <div key={match.id} className="bg-[#1e1e1e] rounded-xl p-3 w-[280px] flex-shrink-0 border border-t-2 border-t-lime-500 border-gray-800 hover:bg-[#252525] transition cursor-pointer">
                        <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <span>{match.league}</span>
                            <span className={match.status === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-lime-500'}>{match.status}</span>
                        </div>

                        <div className="space-y-1 mb-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white">{match.team1.substring(0, 1)}</span>
                                    <span className="font-bold text-white text-sm">{match.team1}</span>
                                </div>
                                <span className="text-white font-mono text-sm">{match.team1Score}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white">{match.team2.substring(0, 1)}</span>
                                    <span className="font-bold text-white text-sm">{match.team2}</span>
                                </div>
                                <span className="text-white font-mono text-sm">{match.team2Score}</span>
                            </div>
                        </div>

                        <div className="text-[11px] text-gray-400 border-t border-gray-700 pt-2 flex justify-between items-center">
                            <span className="truncate max-w-[200px]">{match.result}</span>
                            <ChevronRight className="h-3 w-3" />
                        </div>
                    </div>
                ))}
                <div className="flex items-center justify-center px-4">
                    <button className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 text-white">
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}
