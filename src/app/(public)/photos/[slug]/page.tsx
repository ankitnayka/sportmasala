import { notFound } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Gallery, { IGallery } from '@/models/Gallery';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getGallery(slug: string): Promise<IGallery | null> {
    await dbConnect();
    const gallery = await Gallery.findOne({ slug, status: 'published' });
    if (!gallery) return null;
    return JSON.parse(JSON.stringify(gallery));
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const gallery = await getGallery(slug);

    if (!gallery) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/photos" className="inline-flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Galleries
            </Link>

            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 lh-tight">
                    {gallery.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 border-b pb-6">
                    <div className="flex items-center gap-1">
                        <User size={14} />
                        <span className="font-medium text-gray-700">{gallery.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <time>{new Date(gallery.publishedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8">
                    <p className="text-lg leading-relaxed">{gallery.description}</p>
                </div>
            </header>

            <div className="space-y-12">
                {gallery.photos.map((photo, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 scroll-mt-24" id={`photo-${index + 1}`}>
                        <div className="relative bg-gray-100">
                            <img
                                src={photo.url}
                                alt={photo.description || `Photo ${index + 1} of ${gallery.title}`}
                                className="w-full h-auto object-contain max-h-[600px] mx-auto"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                                {index + 1} / {gallery.photos.length}
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-lg text-gray-800 leading-relaxed font-medium">
                                {photo.description}
                            </p>
                            {/* Social Share placeholder for individual photos if needed */}
                            <div className="mt-4 flex justify-end">
                                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-bold mb-4">More Galleries</h3>
                {/* We could fetch related galleries here later */}
                <Link href="/photos" className="text-red-600 hover:underline font-medium">
                    View all photo galleries &rarr;
                </Link>
            </div>
        </div>
    );
}
