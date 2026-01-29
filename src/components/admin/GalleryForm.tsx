'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { Trash, Plus } from 'lucide-react';

interface GalleryFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        thumbnail: initialData?.thumbnail || '',
        photos: initialData?.photos || [],
        status: initialData?.status || 'draft',
        author: initialData?.author || 'T20 Masala',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (url: string) => {
        setFormData(prev => ({ ...prev, thumbnail: url }));
    };

    const handleThumbnailRemove = () => {
        setFormData(prev => ({ ...prev, thumbnail: '' }));
    };

    // Photo Array Handlers
    const addPhoto = () => {
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, { url: '', description: '' }]
        }));
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_: any, i: number) => i !== index)
        }));
    };

    const handlePhotoChange = (index: number, field: string, value: string) => {
        const newPhotos = [...formData.photos];
        newPhotos[index] = { ...newPhotos[index], [field]: value };
        setFormData(prev => ({ ...prev, photos: newPhotos }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit ? `/api/galleries/${initialData.slug}` : '/api/galleries';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/admin/gallery');
            router.refresh();
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-card-border p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-foreground opacity-70">Title</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-card-border bg-background text-foreground rounded p-2 focus:ring-2 focus:ring-accent outline-hidden" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground opacity-70">Slug (URL)</label>
                    <input required name="slug" value={formData.slug} onChange={handleChange} className="mt-1 block w-full border border-card-border bg-background text-foreground rounded p-2 focus:ring-2 focus:ring-accent outline-hidden" placeholder="e.g. india-pak-match-photos" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground opacity-70">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-card-border bg-background text-foreground rounded p-2 focus:ring-2 focus:ring-accent outline-hidden"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground opacity-70 mb-2">Thumbnail Image</label>
                    <ImageUpload
                        value={formData.thumbnail}
                        onChange={handleThumbnailChange}
                        onRemove={handleThumbnailRemove}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground opacity-70">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-card-border bg-background text-foreground rounded p-2 focus:ring-2 focus:ring-accent outline-hidden">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                {/* Dynamic Photos Section */}
                <div className="col-span-2 border-t border-card-border pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-foreground">Gallery Photos</h3>
                        <button type="button" onClick={addPhoto} className="flex items-center text-sm bg-accent/10 text-accent px-4 py-2 rounded-lg hover:bg-accent/20 transition-all">
                            <Plus size={16} className="mr-1" /> Add Photo
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.photos.map((photo: any, index: number) => (
                            <div key={index} className="flex gap-4 p-4 border border-card-border rounded-xl bg-background/50 items-start shadow-sm">
                                <div className="w-1/3">
                                    <ImageUpload
                                        value={photo.url}
                                        onChange={(url) => handlePhotoChange(index, 'url', url)}
                                        onRemove={() => handlePhotoChange(index, 'url', '')}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-foreground opacity-40 mb-1 uppercase tracking-wider">Photo Description</label>
                                    <textarea
                                        value={photo.description}
                                        onChange={(e) => handlePhotoChange(index, 'description', e.target.value)}
                                        rows={4}
                                        className="w-full border border-card-border bg-background text-foreground rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent outline-hidden"
                                        placeholder="Describe this photo..."
                                    />
                                </div>
                                <button type="button" onClick={() => removePhoto(index)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                        {formData.photos.length === 0 && (
                            <p className="text-center text-foreground opacity-30 py-8 italic">No photos added yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-card-border">
                <button type="submit" className="bg-accent text-white px-8 py-3 rounded-xl hover:brightness-110 font-bold shadow-lg transition-all active:scale-95">
                    {isEdit ? 'Update Gallery' : 'Create Gallery'}
                </button>
            </div>
        </form>
    );
}
