'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MatchFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function MatchForm({ initialData, isEdit = false }: MatchFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        team1: '',
        team2: '',
        date: '',
        venue: '',
        status: 'scheduled',
        result: '',
        score: '',
    });

    useEffect(() => {
        if (initialData) {
            // Format date for datetime-local input
            const dateObj = new Date(initialData.date);
            // Handling offset to show correct local time in input
            const localIso = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

            setFormData({
                ...initialData,
                date: localIso,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/matches/${initialData._id}` : '/api/matches';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save match');

            router.push('/admin/matches');
            router.refresh();
        } catch (error) {
            console.error('Error saving match:', error);
            alert('Failed to save match');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card border border-card-border p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1 opacity-70">Team 1</label>
                    <input
                        type="text"
                        name="team1"
                        value={formData.team1}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                        placeholder="e.g. India"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 opacity-70">Team 2</label>
                    <input
                        type="text"
                        name="team2"
                        value={formData.team2}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                        placeholder="e.g. Australia"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Date & Time</label>
                <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Venue</label>
                <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                    placeholder="e.g. Eden Gardens, Kolkata"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Match Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">🔴 Live</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {formData.status === 'completed' && (
                <div className="space-y-4 border-t border-card-border pt-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-70">Result Summary</label>
                        <input
                            type="text"
                            name="result"
                            value={formData.result}
                            onChange={handleChange}
                            className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                            placeholder="e.g. India won by 20 runs"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-70">Score Details</label>
                        <input
                            type="text"
                            name="score"
                            value={formData.score}
                            onChange={handleChange}
                            className="w-full p-2 border border-card-border rounded bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                            placeholder="e.g. IND 200/4 - AUS 180 All Out"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-foreground/50 hover:text-foreground transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-accent text-white px-8 py-3 rounded-lg hover:brightness-110 disabled:opacity-50 font-bold shadow-lg transition-all active:scale-95"
                >
                    {loading ? 'Saving...' : isEdit ? 'Update Match' : 'Create Match'}
                </button>
            </div>
        </form>
    );
}
