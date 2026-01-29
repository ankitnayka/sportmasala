import Article from '@/models/Article';
import TrendingTopic from '@/models/TrendingTopic';
import dbConnect from '@/lib/db';
import NewsCard from '@/components/NewsCard';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    await dbConnect();
    const topic = await TrendingTopic.findOne({ slug });

    if (!topic) return { title: 'Topic Not Found' };

    return {
        title: `${topic.name} News - T20 Masala`,
        description: `Latest news, updates and analysis on ${topic.name}.`,
    };
}

export default async function TopicPage({ params }: PageProps) {
    const { slug } = await params;
    await dbConnect();

    // 1. Find the Topic
    const topic = await TrendingTopic.findOne({ slug, isActive: true });

    if (!topic) {
        notFound();
    }

    // 2. Find articles containing the search query tag or in the title
    const articles = await Article.find({
        status: 'published',
        $or: [
            { tags: { $in: [topic.searchQuery] } },
            { title: { $regex: topic.searchQuery, $options: 'i' } }
        ]
    }).sort({ publishedAt: -1 }).limit(20);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <span className="text-accent text-sm font-bold uppercase tracking-wider">Topic</span>
                <h1 className="text-3xl md:text-4xl font-bold mt-1">{topic.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Latest news and updates on {topic.name}
                </p>
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <NewsCard key={article._id.toString()} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No articles found for "{topic.name}" yet.</p>
                </div>
            )}
        </div>
    );
}
