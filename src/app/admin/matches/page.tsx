'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Match {
    _id: string;
    team1: string;
    team2: string;
    date: string;
    venue: string;
    status: string;
}

export default function AdminMatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const res = await fetch('/api/matches');
            if (res.ok) {
                const data = await res.json();
                setMatches(data);
            }
        } catch (error) {
            console.error('Failed to fetch matches', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this match?')) return;

        try {
            const res = await fetch(`/api/matches/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setMatches(matches.filter((m) => m._id !== id));
            } else {
                alert('Failed to delete match');
            }
        } catch (error) {
            console.error('Error deleting match', error);
        }
    };

    if (loading) return <div>Loading matches...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <span className="w-2 h-8 bg-accent rounded-full" />
                    Manage Matches
                </h1>
                <Link
                    href="/admin/matches/new"
                    className="bg-accent text-white px-6 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
                >
                    <Plus size={18} /> Add Match
                </Link>
            </div>

            <div className="bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden transition-colors">
                <table className="w-full text-left">
                    <thead className="bg-background/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Schedule Info</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Contestants</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Venue Details</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Match State</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                        {matches.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center opacity-40 italic">
                                    No matches found.
                                </td>
                            </tr>
                        ) : (
                            matches.map((match) => (
                                <tr key={match._id} className="group hover:bg-accent/5 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                                            {format(new Date(match.date), 'MMM d, yyyy')}
                                        </div>
                                        <div className="text-[10px] opacity-30 mt-0.5 font-mono">
                                            {format(new Date(match.date), 'h:mm a')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-bold text-foreground">{match.team1}</span>
                                            <span className="text-[10px] font-black opacity-20 italic">VS</span>
                                            <span className="text-base font-bold text-foreground">{match.team2}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground/60 leading-tight max-w-[200px] truncate">
                                            {match.venue}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border ${match.status === 'live' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' :
                                            match.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {match.status === 'live' && '🔴 '}{match.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                            <Link
                                                href={`/admin/matches/edit/${match._id}`}
                                                className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(match._id)}
                                                className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
