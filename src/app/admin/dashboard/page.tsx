'use client';

import { useEffect, useState } from 'react';
import { IArticle } from '@/models/Article';
import Link from 'next/link';
import AdSenseWidget from '@/components/admin/AdSenseWidget';

export default function AdminDashboard() {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/articles')
            .then((res) => res.json())
            .then((data) => {
                setArticles(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`/api/articles/${slug}`, { method: 'DELETE' });
        if (res.ok) {
            setArticles(articles.filter((a) => a.slug !== slug));
        } else {
            alert('Failed to delete');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <Link
                        href="/admin/matches"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Manage Schedule
                    </Link>
                    <Link
                        href="/admin/articles/new"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Create New Article
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-card-border">
                    <AdSenseWidget />
                </div>
                {loading ? (
                    <div className="p-8 text-center opacity-50">Loading articles...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-card-border">
                            <thead className="bg-background">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-widest">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-widest">Views</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-card-border">
                                {articles.map((article) => (
                                    <tr key={article.slug} className="hover:bg-background/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/admin/articles/${article.slug}`} className="text-accent hover:underline font-medium">
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-foreground/80">{article.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${article.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">{article.views.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <Link href={`/admin/articles/${article.slug}`} className="text-blue-500 hover:text-blue-400">Edit</Link>
                                            <button onClick={() => handleDelete(article.slug)} className="text-red-500 hover:text-red-400 cursor-pointer">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
