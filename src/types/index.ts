export type Category = 'Cricket' | 'Football' | 'World' | 'Politics';

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    content: string; // Markdown or HTML content
    category: Category;
    author: string;
    publishedAt: string | Date; // ISO date string or Date object
    imageUrl?: string;
    storyHighlights?: string[];
    tags?: string[];
}
