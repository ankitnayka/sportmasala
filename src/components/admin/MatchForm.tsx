'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MatchFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function MatchForm({ initialData, isEdit = false }: MatchFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sport: initialData?.sport || 'Cricket',
        series: initialData?.series || '',
        team1: initialData?.team1 || '',
        team2: initialData?.team2 || '',
        team1Score: initialData?.team1Score || '',
        team2Score: initialData?.team2Score || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
        venue: initialData?.venue || '',
        status: initialData?.status || 'Upcoming',
        result: initialData?.result || '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = isEdit ? `/api/matches/${initialData._id}` : '/api/matches';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save match');

            router.push('/admin/matches');
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded shadow max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sport</label>
                    <select name="sport" value={formData.sport} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Series / League</label>
                    <input required name="series" value={formData.series} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="e.g. IPL 2026" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Team 1</label>
                    <input required name="team1" value={formData.team1} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Team 2</label>
                    <input required name="team2" value={formData.team2} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Team 1 Score</label>
                    <input name="team1Score" value={formData.team1Score} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="e.g. 180/4" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Team 2 Score</label>
                    <input name="team2Score" value={formData.team2Score} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="e.g. 175/9" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                    <input required name="venue" value={formData.venue} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
                        <option value="Upcoming">Upcoming</option>
                        <option value="Live">Live</option>
                        <option value="Ended">Ended</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Result / Status Note</label>
                    <input name="result" value={formData.result} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="e.g. India won by 10 runs" />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold disabled:opacity-50">
                    {loading ? 'Saving...' : (isEdit ? 'Update Match' : 'Create Match')}
                </button>
            </div>
        </form>
    );
}
