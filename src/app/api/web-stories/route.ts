import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WebStory from '@/models/WebStory';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        // Public or Admin can access, but filtering might differ. 
        // For this general route, we return all for admin, or filtered for public if used there.
        // Let's assume this is primarily for the Admin List for now, or we filter query params.

        const stories = await WebStory.find({}).sort({ createdAt: -1 });
        return NextResponse.json(stories);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getSession();
        if (!session || (session.role !== 'super_admin' && session.role !== 'sub_admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();

        // Basic validation
        if (!body.title || !body.slug || !body.slides || body.slides.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newStory = await WebStory.create(body);
        return NextResponse.json(newStory);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
