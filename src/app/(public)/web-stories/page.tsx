import Link from 'next/link';
import dbConnect from '@/lib/db';
import WebStory from '@/models/WebStory';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'Web Stories - T20 Masala',
    description: 'Visual stories from the world of cricket and sports.',
};

export const dynamic = 'force-dynamic';

export default async function WebStoriesListPage() {
    await dbConnect();
    const stories = await WebStory.find({ isPublished: true }).sort({ createdAt: -1 });

    return (
        <div className="pb-12">
            <div className="bg-gradient-to-r from-pink-900 to-purple-900 py-12 mb-8">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                        Web <span className="text-pink-500">Stories</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Experience the latest sports news in a visual, immersive format. Swipe through our top stories.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {stories.map((story) => (
                        <Link
                            href={`/web-stories/${story.slug}`}
                            key={story._id}
                            className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-pink-500 transition-all hover:-translate-y-1 shadow-xl"
                        >
                            {/* Cover Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={story.coverImage}
                                    alt={story.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="w-10 h-1 bg-pink-500 mb-3 rounded-full"></div>
                                <h3 className="text-white font-bold text-lg leading-snug line-clamp-3 mb-2 group-hover:text-pink-400 transition-colors">
                                    {story.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                    <PlayCircle size={14} className="text-pink-500" />
                                    Read Story
                                </div>
                            </div>

                            {/* Icon Overlay */}
                            <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full backdrop-blur-sm group-hover:bg-pink-600 transition-colors">
                                <div className="w-4 h-4 border-2 border-white rounded-sm border-t-transparent animate-spin opacity-0 group-hover:opacity-0"></div>
                                {/* Just a static icon usually better */}
                                <div className="space-y-[3px]">
                                    <div className="w-4 h-[2px] bg-white rounded-full"></div>
                                    <div className="w-4 h-[2px] bg-white rounded-full"></div>
                                    <div className="w-4 h-[2px] bg-white rounded-full"></div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {stories.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-gray-400">No stories available right now. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
