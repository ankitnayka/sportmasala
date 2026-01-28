import Match from '@/models/Match';
import dbConnect from '@/lib/db';
import { format } from 'date-fns';

export const revalidate = 60; // Revalidate every minute

async function getMatches() {
    await dbConnect();
    const matches = await Match.find({}).sort({ date: 1 });
    return matches;
}

export default async function SchedulePage() {
    const matches = await getMatches();

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">T20 World Cup Schedule</h1>

            <div className="space-y-4">
                {matches.length === 0 ? (
                    <p className="text-center text-gray-500">No matches scheduled yet.</p>
                ) : (
                    matches.map((match) => (
                        <div key={match._id.toString()} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-center md:text-left">
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {format(new Date(match.date), 'EEEE, d MMMM yyyy • h:mm a')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{match.venue}</p>
                                </div>

                                <div className="flex-1 text-center font-bold text-lg text-gray-800 dark:text-gray-100">
                                    <span className="text-xl">{match.team1}</span>
                                    <span className="mx-3 text-sm text-gray-400">vs</span>
                                    <span className="text-xl">{match.team2}</span>
                                </div>

                                <div className="text-center md:text-right min-w-[120px]">
                                    {match.status === 'scheduled' && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                                            Scheduled
                                        </span>
                                    )}
                                    {match.status === 'live' && (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full animate-pulse dark:bg-red-900/30 dark:text-red-400">
                                            🔴 LIVE
                                        </span>
                                    )}
                                    {match.status === 'completed' && (
                                        <div className="text-sm">
                                            <span className="block font-semibold text-green-600 dark:text-green-400">{match.result}</span>
                                            {match.score && <span className="text-xs text-gray-500 dark:text-gray-400">{match.score}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
