import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;
    // If public (no status param), only show published? 
    // For admin API we might want all.
    // Actually, let's keep it simple: API is general. 
    // If client-side fetching is needed, we filter.
    // But strictly, public pages should fetch server-side directly from DB.
    // This API is mostly for Admin Dashboard or client-side load more.

    try {
        const articles = await Article.find(query).sort({ publishedAt: -1 });
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await request.json();
        // Basic validation could go here
        const article = await Article.create(body);
        return NextResponse.json(article, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
