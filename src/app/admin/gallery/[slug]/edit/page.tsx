'use client';

import { useEffect, useState } from 'react';
import GalleryForm from '@/components/admin/GalleryForm';
import { useParams } from 'next/navigation';

export default function EditGalleryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/galleries/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setGallery(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!gallery) return <div className="p-8 text-center text-red-500">Gallery not found</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Edit Photo Gallery</h1>
            <GalleryForm initialData={gallery} isEdit={true} />
        </div>
    );
}
