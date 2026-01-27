import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Match from '@/models/Match';
import { getSession } from '@/lib/auth';

interface Props {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, props: Props) {
    await dbConnect();
    const params = await props.params;

    try {
        const match = await Match.findById(params.id);
        if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
        return NextResponse.json(match);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, props: Props) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const params = await props.params;

    try {
        const body = await request.json();
        const match = await Match.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
        return NextResponse.json(match);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, props: Props) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const params = await props.params;

    try {
        const match = await Match.findByIdAndDelete(params.id);
        if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
