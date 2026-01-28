'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { IWebStory } from '@/models/WebStory';
import { format } from 'date-fns';

export default function WebStoriesPage() {
    const [stories, setStories] = useState<IWebStory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/web-stories');
            if (res.ok) {
                const data = await res.json();
                setStories(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this story?')) return;
        try {
            const res = await fetch(`/api/web-stories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setStories(stories.filter(s => (s as any)._id !== id));
            }
        } catch (error) {
            console.error('Delete error', error);
        }
    };

    if (loading) return <div className="p-8">Loading stories...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileText className="text-pink-600" />
                    Web Stories
                </h1>
                <Link
                    href="/admin/web-stories/new"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
                >
                    <Plus size={18} /> Create New Story
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story: any) => (
                    <div key={story._id} className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-zinc-700">
                        <div className="relative aspect-[9/16] bg-gray-200">
                            {story.coverImage && (
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded ${story.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                    {story.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-bold mb-2 line-clamp-2 dark:text-white">{story.title}</h2>
                            <p className="text-xs text-gray-500 mb-4">
                                {format(new Date(story.createdAt), 'MMM d, yyyy')} • {story.slides.length} Slides
                            </p>
                            <div className="flex justify-end gap-2">
                                <Link
                                    href={`/admin/web-stories/${story._id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(story._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {stories.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No stories found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
