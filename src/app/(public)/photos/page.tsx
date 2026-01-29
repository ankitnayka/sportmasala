import Link from 'next/link';
import dbConnect from '@/lib/db';
import Gallery, { IGallery } from '@/models/Gallery';
import { Camera } from 'lucide-react';

// Force dynamic rendering so we always get the latest galleries
export const dynamic = 'force-dynamic';

async function getGalleries(): Promise<IGallery[]> {
    await dbConnect();
    const galleries = await Gallery.find({ status: 'published' }).sort({ publishedAt: -1 });
    // Serialize Mongoose documents to plain objects
    return JSON.parse(JSON.stringify(galleries));
}

export default async function PhotosPage() {
    const galleries = await getGalleries();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Camera className="text-red-600" /> Photo Galleries
            </h1>

            {galleries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">No photo galleries published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleries.map((gallery) => (
                        <Link href={`/photos/${gallery.slug}`} key={gallery.slug} className="group">
                            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 h-full flex flex-col">
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                    <img
                                        src={gallery.thumbnail}
                                        alt={gallery.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <Camera size={12} />
                                        {gallery.photos.length}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                                        {gallery.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                                        {gallery.description}
                                    </p>
                                    <div className="text-xs text-gray-400 mt-auto">
                                        {new Date(gallery.publishedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
