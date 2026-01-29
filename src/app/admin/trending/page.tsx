'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, Star } from 'lucide-react';

interface TrendingTopic {
    _id: string;
    name: string;
    slug: string;
    searchQuery: string;
    priority: number;
    isActive: boolean;
}

export default function TrendingAdminPage() {
    const [topics, setTopics] = useState<TrendingTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        searchQuery: '',
        priority: 10,
        isActive: true,
    });

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await fetch('/api/trending');
            if (res.ok) {
                const data = await res.json();
                setTopics(data);
            }
        } catch (error) {
            console.error('Error fetching topics', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (topic: TrendingTopic) => {
        setFormData({
            name: topic.name,
            slug: topic.slug,
            searchQuery: topic.searchQuery,
            priority: topic.priority,
            isActive: topic.isActive,
        });
        setEditId(topic._id);
        setIsEditing(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', slug: '', searchQuery: '', priority: 10, isActive: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing && editId ? `/api/trending/${editId}` : '/api/trending';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            await fetchTopics();
            handleCancel();
        } catch (error: any) {
            console.error('Error saving', error);
            alert(error.message || 'Failed to save topic');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/trending/${id}`, { method: 'DELETE' });
            setTopics(topics.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting', error);
        }
    };

    // Auto-slug generator
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (!isEditing) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, name, slug, searchQuery: slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" />
                Manage Trending Topics
            </h1>

            {/* Create/Edit Form */}
            <div className="bg-card border border-card-border p-8 rounded-xl shadow-lg mb-8 transition-colors">
                <h2 className="text-xl font-bold mb-6 text-foreground">{isEditing ? 'Edit Topic' : 'Add New Topic'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-70">Display Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            placeholder="e.g. WPL 2026"
                            className="w-full p-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-70">Slug (URL)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            placeholder="e.g. wpl-2026"
                            className="w-full p-2.5 border border-card-border rounded-lg bg-background text-foreground font-mono text-sm focus:ring-2 focus:ring-accent outline-hidden transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-70">Search Tag (Internal)</label>
                        <input
                            type="text"
                            value={formData.searchQuery}
                            onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                            required
                            placeholder="e.g. wpl"
                            className="w-full p-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                        />
                        <p className="text-xs text-foreground/40 mt-1.5 italic">Articles with this tag will be shown.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 opacity-70">Priority</label>
                            <input
                                type="number"
                                value={formData.priority}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setFormData({ ...formData, priority: isNaN(val) ? 0 : val });
                                }}
                                className="w-full p-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                            />
                            <p className="text-xs text-foreground/40 mt-1.5 italic">Lower number = First in list.</p>
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-accent"
                                />
                                <span className="ml-2 font-medium group-hover:text-accent transition-colors">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-card-border">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 text-foreground/50 hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-accent text-white px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-lg font-bold hover:brightness-110 active:scale-95 transition-all"
                        >
                            {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                            {isEditing ? 'Update Topic' : 'Add Topic'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="space-y-4">
                {topics.map((topic) => (
                    <div key={topic._id} className="flex items-center justify-between bg-card p-5 rounded-xl shadow-sm border border-card-border hover:border-accent/30 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-foreground/40 shadow-inner group-hover:text-accent group-hover:bg-accent/5 transition-all">
                                {topic.priority}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">{topic.name}</h3>
                                <div className="flex gap-2 text-xs font-mono mt-1">
                                    <span className="bg-background text-foreground/40 px-2 py-0.5 rounded border border-card-border">/{topic.slug}</span>
                                    <span className="bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20">tag: {topic.searchQuery}</span>
                                    {!topic.isActive && <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-tighter">INACTIVE</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(topic)}
                                className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(topic._id)}
                                className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
