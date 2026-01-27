import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Match from '@/models/Match';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const status = searchParams.get('status');

    const query: any = {};
    if (sport) query.sport = sport;
    if (status) query.status = status;

    try {
        // Sort by date ascending (nearest first)
        const matches = await Match.find(query).sort({ date: 1 });
        return NextResponse.json(matches);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const match = await Match.create(body);
        return NextResponse.json(match, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
