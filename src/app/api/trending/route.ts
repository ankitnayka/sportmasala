import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TrendingTopic from '@/models/TrendingTopic';

export async function GET() {
    try {
        await dbConnect();
        const topics = await TrendingTopic.find({}).sort({ priority: 1, updatedAt: -1 });
        return NextResponse.json(topics);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const topic = await TrendingTopic.create(body);
        return NextResponse.json(topic);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
