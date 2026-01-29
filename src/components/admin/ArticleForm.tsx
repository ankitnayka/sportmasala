'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface ArticleFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ArticleForm({ initialData, isEdit = false }: ArticleFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        category: initialData?.category || 'Cricket',
        author: initialData?.author || 'T20 Masala',
        status: initialData?.status || 'draft',
        imageUrl: initialData?.imageUrl || '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleImageRemove = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit ? `/api/articles/${initialData.slug}` : '/api/articles';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/admin/dashboard');
            router.refresh();
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                    <input required name="slug" value={formData.slug} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="e.g. india-wins-wc" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="World">World</option>
                        <option value="Politics">Politics</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input required name="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="mt-1 block w-full border rounded p-2"></textarea>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Article Image</label>
                    <ImageUpload
                        value={formData.imageUrl}
                        onChange={handleImageChange}
                        onRemove={handleImageRemove}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold">
                    {isEdit ? 'Update Article' : 'Publish Article'}
                </button>
            </div>
        </form>
    );
}
