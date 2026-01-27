import { getArticlesByCategory } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { Category } from "@/types";

interface Props {
    params: Promise<{ category: string }>;
}

// Map slug to proper Category type
function getCategoryFromSlug(slug: string): Category | null {
    const map: Record<string, Category> = {
        'cricket': 'Cricket',
        'football': 'Football',
        'world': 'World',
        'politics': 'Politics' // if used
    };
    return map[slug?.toLowerCase()] || null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const category = getCategoryFromSlug(params.category);
    if (!category) return { title: 'Not Found' };

    return {
        title: `${category} News`,
        description: `Latest updates and analysis on ${category}.`,
    };
}

export default async function CategoryPage(props: Props) {
    const params = await props.params;
    const category = getCategoryFromSlug(params.category);

    if (!category) {
        notFound();
    }

    const articles = await getArticlesByCategory(category);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdPlaceholder slot="header" className="mb-8" />

            <div className="mb-8 flex items-center gap-3">
                <div className="h-8 w-2 bg-lime-500 rounded-sm"></div>
                <h1 className="text-4xl font-bold text-white capitalize tracking-tight">
                    {category} News
                </h1>
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map(article => (
                        <NewsCard key={article.slug} article={article} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-500 bg-[#1e1e1e] rounded-xl border border-gray-800">
                    <p className="text-xl">No articles found in {category}.</p>
                </div>
            )}

            <AdPlaceholder slot="footer" className="mt-12" />
        </div>
    );
}
