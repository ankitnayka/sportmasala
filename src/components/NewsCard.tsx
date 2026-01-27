import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

export default function NewsCard({ article }: { article: Article }) {
    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="group flex flex-col h-full bg-card rounded-xl overflow-hidden hover:shadow-lg transition border border-card-border">
            <Link href={`/article/${article.slug}`} className="block relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {article.imageUrl ? (
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-gray-800">
                        <span className="text-xs">No Image</span>
                    </div>
                )}
            </Link>
            <div className="flex flex-col p-4 flex-grow">
                <div className="mb-2">
                    <span className="inline-block text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
                        {article.category}
                    </span>
                </div>
                <Link href={`/article/${article.slug}`} className="block mb-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent line-clamp-2 leading-tight">
                        {article.title}
                    </h3>
                </Link>
                <div className="text-[11px] text-gray-500 mt-auto pt-3 border-t border-card-border flex justify-between items-center">
                    <span>{article.author}</span>
                    <span>{formattedDate}</span>
                </div>
            </div>
        </div>
    );
}
