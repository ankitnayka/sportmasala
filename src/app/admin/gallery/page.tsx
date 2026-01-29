'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IGallery } from '@/models/Gallery';
import { Plus, Edit, Trash, Image as ImageIcon } from 'lucide-react';

export default function GalleryList() {
    const [galleries, setGalleries] = useState<IGallery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/galleries')
            .then((res) => res.json())
            .then((data) => {
                setGalleries(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this gallery?')) return;
        const res = await fetch(`/api/galleries/${slug}`, { method: 'DELETE' });
        if (res.ok) {
            setGalleries(galleries.filter((g) => g.slug !== slug));
        } else {
            alert('Failed to delete');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ImageIcon className="h-8 w-8" /> Photo Galleries
                </h1>
                <Link
                    href="/admin/gallery/new"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                >
                    <Plus size={20} /> Create New Gallery
                </Link>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading galleries...</div>
                ) : galleries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No galleries found. Create one to get started.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photos</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {galleries.map((gallery) => (
                                <tr key={gallery.slug}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-12 w-20 overflow-hidden rounded bg-gray-100 relative">
                                            {gallery.thumbnail ? (
                                                <img src={gallery.thumbnail} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                                        <div className="text-xs text-gray-500">/{gallery.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gallery.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {gallery.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {gallery.photos?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <Link href={`/admin/gallery/${gallery.slug}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1">
                                            <Edit size={16} /> Edit
                                        </Link>
                                        <button onClick={() => handleDelete(gallery.slug)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                            <Trash size={16} /> Delete
                                        </button>
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
