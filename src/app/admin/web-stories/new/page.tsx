'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react';

interface ISlide {
    imageUrl: string;
    text: string;
}

export default function NewWebStoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [linkedArticleSlug, setLinkedArticleSlug] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    const [slides, setSlides] = useState<ISlide[]>([
        { imageUrl: '', text: '' } // Start with 1 empty slide
    ]);

    const addSlide = () => {
        setSlides([...slides, { imageUrl: '', text: '' }]);
    };

    const removeSlide = (index: number) => {
        if (slides.length <= 1) return;
        setSlides(slides.filter((_, i) => i !== index));
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === slides.length - 1) return;

        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
        setSlides(newSlides);
    };

    const updateSlide = (index: number, field: keyof ISlide, value: string) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/web-stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    coverImage,
                    linkedArticleSlug,
                    isPublished,
                    slides
                })
            });

            if (res.ok) {
                router.push('/admin/web-stories');
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create story');
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate slug
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Web Story</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow border border-gray-200 dark:border-zinc-700">
                    <h2 className="text-xl font-bold mb-4">Story Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                value={title}
                                onChange={handleTitleChange}
                                className="w-full p-2 border rounded dark:bg-zinc-900"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Slug</label>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-900"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Linked Article Slug (Optional)</label>
                            <input
                                value={linkedArticleSlug}
                                onChange={(e) => setLinkedArticleSlug(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-900"
                                placeholder="e.g. india-vs-sa-highlights"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <div className="flex items-center gap-2 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                        className="w-5 h-5 accent-pink-600"
                                    />
                                    <span>Publish Immediately</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow border border-gray-200 dark:border-zinc-700">
                    <h2 className="text-xl font-bold mb-4">Cover Image (9:16 recommended)</h2>
                    <ImageUpload
                        value={coverImage}
                        onChange={setCoverImage}
                        onRemove={() => setCoverImage('')}
                    />
                </div>

                {/* Slides */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Slides ({slides.length})</h2>
                        <button
                            type="button"
                            onClick={addSlide}
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Plus size={18} /> Add Slide
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slides.map((slide, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border border-gray-200 dark:border-zinc-700 relative group">
                                <div className="absolute top-2 right-2 z-10 flex gap-1 bg-black/50 p-1 rounded">
                                    <button
                                        type="button"
                                        onClick={() => moveSlide(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-white hover:text-green-400 disabled:opacity-30"
                                    >
                                        <MoveUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSlide(index, 'down')}
                                        disabled={index === slides.length - 1}
                                        className="p-1 text-white hover:text-green-400 disabled:opacity-30"
                                    >
                                        <MoveDown size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeSlide(index)}
                                        className="p-1 text-white hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold mb-2">Slide Image (9:16)</label>
                                    <ImageUpload
                                        value={slide.imageUrl}
                                        onChange={(url) => updateSlide(index, 'imageUrl', url)}
                                        onRemove={() => updateSlide(index, 'imageUrl', '')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-2">Caption / Text</label>
                                    <textarea
                                        value={slide.text}
                                        onChange={(e) => updateSlide(index, 'text', e.target.value)}
                                        className="w-full p-2 border rounded h-20 text-sm dark:bg-zinc-900"
                                        maxLength={200}
                                        placeholder="Short engaging text..."
                                    />
                                </div>

                                <div className="mt-2 text-xs text-gray-500 text-center font-mono">
                                    Slide #{index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl flex justify-end gap-4 shadow-xl z-20">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save size={18} /> {loading ? 'Saving...' : 'Create Story'}
                    </button>
                </div>
            </form>
        </div>
    );
}
