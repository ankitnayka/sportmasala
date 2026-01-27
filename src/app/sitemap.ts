import { getArticles } from '@/lib/data';
import { MetadataRoute } from 'next';

const baseUrl = 'https://t20masala.com'; // Replace with actual domain later

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = await getArticles();

    const articleUrls = articles.map((article) => ({
        url: `${baseUrl}/article/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/cricket`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/football`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/world`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...articleUrls,
    ];
}
