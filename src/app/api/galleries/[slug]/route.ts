import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getSession } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    await dbConnect();
    const { slug } = await params;
    try {
        const gallery = await Gallery.findOne({ slug });
        if (!gallery) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }
        return NextResponse.json(gallery);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    try {
        const body = await request.json();
        const gallery = await Gallery.findOneAndUpdate(
            { slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!gallery) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }
        return NextResponse.json(gallery);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    try {
        const result = await Gallery.findOneAndDelete({ slug });
        if (!result) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Gallery deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
    }
}
