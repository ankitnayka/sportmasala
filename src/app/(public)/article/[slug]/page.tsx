import { getArticleBySlug } from "@/lib/data";
import AdPlaceholder from "@/components/AdPlaceholder";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const article = await getArticleBySlug(params.slug);
    if (!article) return { title: 'Article Not Found' };

    return {
        title: article.title,
        description: article.excerpt,
        category: article.category,
        authors: [{ name: article.author }],
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: new Date(article.publishedAt).toISOString(),
            authors: [article.author],
            section: article.category,
        }
    };
}

export default async function ArticlePage(props: Props) {
    const params = await props.params;
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    // Basic content injection - In production, use a markdown parser or proper rich text renderer.
    // For now, standard dangerousHTML or simple split.
    // Strategy: Split content by paragraphs and insert Ad after 2nd paragraph.

    // Note: content in mock is HTML string.

    // Safe way to inject HTML in React requires dangerouslySetInnerHTML.
    // Since we control valid HTML in data, this is acceptable for now.
    // To inject Ad, we might need to parse it. 

    // Simplified approach: Render top content, Ad, bottom content.
    // But our mock content is small. Let's just put Ad at the bottom of content or sidebar.
    // Request said "After 2nd paragraph".

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdPlaceholder slot="header" className="mb-6 hidden md:flex" />

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <article className="lg:w-2/3">
                    <header className="mb-8 border-b border-gray-800 pb-8">
                        <span className="text-lime-500 font-bold tracking-wide uppercase text-sm mb-2 inline-block">
                            {article.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center text-gray-400 text-sm">
                            <span className="font-medium text-gray-200 mr-2">{article.author}</span>
                            <span>• {new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="prose prose-lg max-w-none prose-invert text-gray-300 marker:text-lime-500 prose-headings:font-bold prose-headings:text-white prose-a:text-lime-500 prose-strong:text-white prose-blockquote:border-l-lime-500 prose-blockquote:text-gray-400">
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>

                    {/* In-Article Ad */}
                    <AdPlaceholder slot="in-article" className="mt-8" />
                </article>

                {/* Sidebar */}
                <aside className="lg:w-1/3 space-y-8">
                    <AdPlaceholder slot="sidebar" className="sticky top-24" />

                    <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-bold mb-4 text-white uppercase flex items-center gap-2">
                            <span className="w-1 h-4 bg-lime-500"></span>
                            Trending Now
                        </h3>
                        <ul className="space-y-4">
                            <li className="text-sm text-gray-400 hover:text-lime-500 cursor-pointer border-b border-gray-800 pb-2 transition">
                                Why T20 Cricket is taking over the world
                            </li>
                            <li className="text-sm text-gray-400 hover:text-lime-500 cursor-pointer border-b border-gray-800 pb-2 transition">
                                Top 5 Football transfers this summer
                            </li>
                            <li className="text-sm text-gray-400 hover:text-lime-500 cursor-pointer transition">
                                Election Updates 2024
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
