'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { Article } from '@/types';

interface EditorsChoiceProps {
    articles: Article[];
}

export default function EditorsChoice({ articles }: EditorsChoiceProps) {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 4);

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-accent"></div>
                <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">Editor's Choice</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Hero Article */}
                <Link href={`/article/${mainArticle.slug}`} className="lg:col-span-2 group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                        {mainArticle.imageUrl ? (
                            <Image
                                src={mainArticle.imageUrl}
                                alt={mainArticle.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <span className="bg-accent text-white dark:text-black text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                                {mainArticle.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-accent transition">
                                {mainArticle.title}
                            </h3>
                        </div>
                    </div>
                </Link>

                {/* Side List */}
                <div className="space-y-4">
                    {sideArticles.map((article) => (
                        <Link href={`/article/${article.slug}`} key={article.slug} className="flex gap-3 group cursor-pointer bg-card p-2 rounded-lg hover:shadow-md transition border border-card-border">
                            <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                                {article.imageUrl ? (
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800"></div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                                    <PlayCircle className="text-white w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-accent line-clamp-2 leading-snug mb-1">
                                    {article.title}
                                </h4>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">{article.category}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
