import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import WebStory from '@/models/WebStory';
import StoryPlayer from '@/components/StoryPlayer';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getStory(slug: string) {
    await dbConnect();
    const story = await WebStory.findOne({ slug, isPublished: true }).lean();
    if (!story) return null;

    // Serialize _id and dates to plain strings for Client Component
    return {
        ...story,
        _id: story._id.toString(),
        createdAt: story.createdAt?.toString(),
        updatedAt: story.updatedAt?.toString(),
        slides: story.slides.map((slide: any) => ({
            ...slide,
            _id: slide._id ? slide._id.toString() : undefined,
        }))
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const story = await getStory(slug);
    if (!story) return { title: 'Story Not Found' };

    return {
        title: `${story.title} | Web Stories`,
        description: story.slides[0]?.text || `Check out this visual story about ${story.title}`,
        openGraph: {
            images: [story.coverImage],
            type: 'article',
        }
    };
}

export default async function WebStoryPage({ params }: Props) {
    const { slug } = await params;
    const story = await getStory(slug);

    if (!story) {
        notFound();
    }

    // JSON-LD for Google Search (Validation)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization", // Simplified for now, typically implies article-like
        // Actual WebStory schema is specific (amphtml), but here we provide Article/ImageObject schema
        "headline": story.title,
        "image": [story.coverImage],
        "datePublished": story.createdAt
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* The Layout wraps this in a div, but for Full Screen player we ideally want to break out. 
                However, nextjs app dir layouts are nested. 
                We can use a fixed overlay z-index in StoryPlayer to cover everything. 
            */}
            <StoryPlayer
                title={story.title}
                slides={story.slides}
                linkedArticleSlug={story.linkedArticleSlug}
            />
        </>
    );
}
