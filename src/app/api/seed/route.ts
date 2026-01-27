import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Match from '@/models/Match';
import Article from '@/models/Article';
import { seedArticles, seedMatches } from '@/lib/seed-content';

export async function GET(request: Request) {
    await dbConnect();

    // Simple protection to prevent accidental public seeding
    // In prod, you might want to remove this route or protect it better.
    // For 'deploy now' usage, we just let it run or check a generic param.
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Use a hardcoded secret for this one-off operation
    if (secret !== 'seed-t20masala-now') {
        return NextResponse.json({ error: 'Unauthorized. Use ?secret=seed-t20masala-now' }, { status: 401 });
    }

    try {
        let createdCount = 0;
        let matchCount = 0;

        // Seed Articles
        for (const article of seedArticles) {
            // Check if slug exists to avoid duplicates
            const exists = await Article.findOne({ slug: article.slug });
            if (!exists) {
                await Article.create(article);
                createdCount++;
            }
        }

        // Seed Matches
        for (const match of seedMatches) {
            const exists = await Match.findOne({ team1: match.team1, team2: match.team2, date: match.date });
            if (!exists) {
                await Match.create(match);
                matchCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Database seeded! Added ${createdCount} new articles and ${matchCount} matches.`,
            totalSeeded: createdCount,
            matchesSeeded: matchCount
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
