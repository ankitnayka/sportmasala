import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TrendingTopic from '@/models/TrendingTopic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const body = await request.json();
        const topic = await TrendingTopic.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(topic);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        await TrendingTopic.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
