import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WebStory from '@/models/WebStory';
import { getSession } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const story = await WebStory.findById(id);
        if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        return NextResponse.json(story);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getSession();
        if (!session || !['super_admin', 'sub_admin'].includes(session.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const updatedStory = await WebStory.findByIdAndUpdate(id, body, { new: true });

        if (!updatedStory) return NextResponse.json({ error: 'Story not found' }, { status: 404 });

        return NextResponse.json(updatedStory);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getSession();
        if (!session || !['super_admin', 'sub_admin'].includes(session.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const deletedStory = await WebStory.findByIdAndDelete(id);
        if (!deletedStory) return NextResponse.json({ error: 'Story not found' }, { status: 404 });

        return NextResponse.json({ message: 'Story deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
