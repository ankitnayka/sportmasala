'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPromptPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Cricket',
        promptTemplate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/automation/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/automation');
            } else {
                alert('Failed to save prompt');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving prompt');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/automation" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Automation
                </Link>
                <h1 className="text-3xl font-bold">New Content Prompt</h1>
                <p className="text-gray-500 mt-2">Define a template for daily article generation.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Internal Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Daily Cricket Recap"
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            className="w-full border border-gray-300 rounded p-2"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {['Cricket', 'Football', 'World', 'Politics', 'Tennis', 'WWE'].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prompt Template
                        <span className="block text-xs text-gray-400 font-normal mt-1">
                            The AI will use this instructions. Be specific about focus, tone, and data sources (if any).
                        </span>
                    </label>
                    <textarea
                        required
                        rows={8}
                        placeholder="Write a summary of today's most trending topic in Cricket..."
                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm"
                        value={formData.promptTemplate}
                        onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 text-white px-6 py-2.5 rounded hover:bg-red-700 flex items-center gap-2 font-medium disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Prompt'}
                    </button>
                </div>
            </form>
        </div>
    );
}
