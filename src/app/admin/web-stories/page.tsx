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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story: any) => (
                    <div key={story._id} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-card-border hover:border-accent/30 transition-all group">
                        <div className="relative aspect-[9/16] bg-background/50">
                            {story.coverImage && (
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full shadow-lg ${story.isPublished ? 'bg-green-500 text-white' : 'bg-background/80 text-foreground backdrop-blur-md'}`}>
                                    {story.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h2 className="text-lg font-bold mb-2 line-clamp-2 text-foreground group-hover:text-accent transition-colors">{story.title}</h2>
                            <p className="text-xs font-medium text-foreground/40 mb-6 flex items-center gap-2">
                                <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
                                <span className="w-1 h-1 bg-foreground/20 rounded-full" />
                                <span>{story.slides.length} Slides</span>
                            </p>
                            <div className="flex justify-end gap-3 pt-4 border-t border-card-border/50">
                                <Link
                                    href={`/admin/web-stories/${story._id}`}
                                    className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                                >
                                    <Edit size={20} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(story._id)}
                                    className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {stories.length === 0 && (
                    <div className="col-span-full py-20 text-center text-foreground opacity-30 italic">
                        No stories found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
