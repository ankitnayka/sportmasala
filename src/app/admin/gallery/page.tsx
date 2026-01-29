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
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                    <ImageIcon className="h-8 w-8 text-accent" /> Photo Galleries
                </h1>
                <Link
                    href="/admin/gallery/new"
                    className="bg-accent text-white px-6 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
                >
                    <Plus size={20} /> Create New Gallery
                </Link>
            </div>

            <div className="bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden transition-colors">
                {loading ? (
                    <div className="p-20 text-center opacity-40 italic">Loading galleries...</div>
                ) : galleries.length === 0 ? (
                    <div className="p-20 text-center opacity-40 italic">No galleries found. Create one to get started.</div>
                ) : (
                    <table className="min-w-full divide-y divide-card-border">
                        <thead className="bg-background/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Thumbnail</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Gallery Info</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Media Type</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {galleries.map((gallery) => (
                                <tr key={gallery.slug} className="hover:bg-accent/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-16 w-24 overflow-hidden rounded-xl bg-background/50 border border-card-border relative shadow-sm group-hover:border-accent/30 transition-all">
                                            {gallery.thumbnail ? (
                                                <img src={gallery.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-foreground/10">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{gallery.title}</div>
                                        <div className="text-[10px] font-mono opacity-30 mt-0.5">/{gallery.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-[10px] font-bold rounded-full border ${gallery.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} uppercase tracking-wider`}>
                                            {gallery.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-xs font-medium text-foreground/40">
                                            <ImageIcon size={14} className="opacity-50" />
                                            <span>{gallery.photos?.length || 0} Photos</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                            <Link href={`/admin/gallery/${gallery.slug}/edit`} className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(gallery.slug)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                <Trash size={18} />
                                            </button>
                                        </div>
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
