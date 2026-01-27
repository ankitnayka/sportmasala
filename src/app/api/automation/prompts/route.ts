import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AutoPrompt from '@/models/AutoPrompt';

export async function GET() {
    try {
        await dbConnect();
        const prompts = await AutoPrompt.find({}).sort({ createdAt: -1 });
        return NextResponse.json(prompts);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newPrompt = await AutoPrompt.create(body);
        return NextResponse.json(newPrompt);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
