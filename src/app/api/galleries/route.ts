import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status) query.status = status;

    try {
        const galleries = await Gallery.find(query).sort({ publishedAt: -1 });
        return NextResponse.json(galleries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
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
        const gallery = await Gallery.create(body);
        return NextResponse.json(gallery, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
