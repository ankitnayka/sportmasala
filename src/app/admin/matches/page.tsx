'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

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
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Matches</h1>
                <Link
                    href="/admin/matches/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                    + Add Match
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Teams</th>
                            <th className="p-4">Venue</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No matches found.
                                </td>
                            </tr>
                        ) : (
                            matches.map((match) => (
                                <tr key={match._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-4">
                                        {format(new Date(match.date), 'MMM d, yyyy h:mm a')}
                                    </td>
                                    <td className="p-4 font-semibold">
                                        {match.team1} vs {match.team2}
                                    </td>
                                    <td className="p-4">{match.venue}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${match.status === 'live' ? 'bg-red-100 text-red-800' :
                                                match.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {match.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/matches/edit/${match._id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(match._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
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
