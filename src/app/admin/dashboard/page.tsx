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

            <div className="bg-white rounded shadow overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <AdSenseWidget />
                </div>
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.slug}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/admin/articles/${article.slug}`} className="text-blue-600 hover:underline">
                                            {article.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{article.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.views}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <Link href={`/admin/articles/${article.slug}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                        <button onClick={() => handleDelete(article.slug)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
