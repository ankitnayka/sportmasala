import dbConnect from "@/lib/db";
import Article, { IArticle } from "@/models/Article";
import { cache } from 'react';

// Use local type or global type, but for now ensure compatibility with UI components.
// The UI expects fields that match IArticle mostly.

export const getArticles = cache(async () => {
    await dbConnect();
    // Use .lean() to get POJOs
    const articles = await Article.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(20).lean();
    // Serialize manually to avoid "Only plain objects can be passed to Client Components" warning if passed directly
    return JSON.parse(JSON.stringify(articles)) as IArticle[];
});

export const getArticlesByCategory = cache(async (category: string) => {
    await dbConnect();
    const articles = await Article.find({ category, status: 'published' }).sort({ publishedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(articles)) as IArticle[];
});

export const getArticleBySlug = cache(async (slug: string) => {
    await dbConnect();
    const article = await Article.findOne({ slug, status: 'published' }).lean();
    if (!article) return undefined;
    return JSON.parse(JSON.stringify(article)) as IArticle;
});
