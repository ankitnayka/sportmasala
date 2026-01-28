import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TrendingTopic from '@/models/TrendingTopic';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        // Publicly accessible, return only active ones usually, but for admin we might want all?
        // Let's return all sorted by priority for now, and filter on frontend if needed.
        const topics = await TrendingTopic.find({}).sort({ priority: 1, updatedAt: -1 });
        return NextResponse.json(topics);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const topic = await TrendingTopic.create(body);
        return NextResponse.json(topic);
    } catch (error: any) {
        // Handle duplicate slug error
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
