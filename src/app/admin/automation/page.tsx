'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Play, Pause, Trash2, Zap } from 'lucide-react';

interface AutoPrompt {
    _id: string;
    title: string;
    category: string;
    isActive: boolean;
    lastRunAt?: string;
}

export default function AutomationPage() {
    const [prompts, setPrompts] = useState<AutoPrompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrompts();
    }, []);

    const fetchPrompts = async () => {
        const res = await fetch('/api/automation/prompts');
        if (res.ok) {
            const data = await res.json();
            setPrompts(data);
        }
        setLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        await fetch(`/api/automation/prompts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !currentStatus }),
        });
        fetchPrompts();
    };

    const deletePrompt = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`/api/automation/prompts/${id}`, { method: 'DELETE' });
        fetchPrompts();
    };

    // Manual Trigger (For testing)
    const runManually = async () => {
        if (!confirm('Run ALL active prompts now? This will generate articles.')) return;
        // Logic to trigger cron endpoint manually (requires passing secret or using a separate internal API)
        // For simplicity in this demo, accessing the public cron URL with secret if possible, or an internal helper.
        // We will call a proxy API here.
        alert('To test manually, visit /api/cron/daily-content?secret=YOUR_CRON_SECRET (Requires setup). For now, use the Vercel dashboard to trigger cron.');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Content Automation</h1>
                <div className="flex gap-4">
                    <button onClick={runManually} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                        <Zap className="h-4 w-4" /> Run Now
                    </button>
                    <Link href="/admin/automation/new" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        <Plus className="h-4 w-4" /> New Prompt
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Last Run</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prompts.map((prompt) => (
                            <tr key={prompt._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{prompt.title}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{prompt.category}</span>
                                </td>
                                <td className="p-4">
                                    {prompt.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                                            <Play className="h-3 w-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold">
                                            <Pause className="h-3 w-3" /> Paused
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {prompt.lastRunAt ? new Date(prompt.lastRunAt).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => toggleStatus(prompt._id, prompt.isActive)}
                                        className="p-2 text-gray-500 hover:bg-gray-200 rounded"
                                        title="Toggle Status"
                                    >
                                        {prompt.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={() => deletePrompt(prompt._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {prompts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No automation prompts found. Create one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
