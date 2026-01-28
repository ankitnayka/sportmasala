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

            if (!res.ok) throw new Error('Failed to save');

            await fetchTopics();
            handleCancel();
        } catch (error) {
            console.error('Error saving', error);
            alert('Failed to save topic');
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Topic' : 'Add New Topic'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Display Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            placeholder="e.g. WPL 2026"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            placeholder="e.g. wpl-2026"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Search Tag (Internal)</label>
                        <input
                            type="text"
                            value={formData.searchQuery}
                            onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                            required
                            placeholder="e.g. wpl"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <p className="text-xs text-gray-400 mt-1">Articles with this tag will be shown.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <input
                                type="number"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <p className="text-xs text-gray-400 mt-1">Lower number = First in list.</p>
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-primary"
                                />
                                <span className="ml-2 font-medium">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                        >
                            {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                            {isEditing ? 'Update Topic' : 'Add Topic'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="space-y-3">
                {topics.map((topic) => (
                    <div key={topic._id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                                {topic.priority}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{topic.name}</h3>
                                <div className="flex gap-2 text-xs text-gray-500 font-mono">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/{topic.slug}</span>
                                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1 rounded">tag: {topic.searchQuery}</span>
                                    {!topic.isActive && <span className="bg-red-100 text-red-600 px-1 rounded">INACTIVE</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(topic)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(topic._id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
