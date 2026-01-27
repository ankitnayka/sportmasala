import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import { getSession } from '@/lib/auth';

interface Props {
    params: Promise<{ slug: string }>
}

export async function GET(request: Request, props: Props) {
    const params = await props.params;
    await dbConnect();
    try {
        const article = await Article.findOne({
            $or: [
                { slug: params.slug },
                { _id: params.slug.match(/^[0-9a-fA-F]{24}$/) ? params.slug : null }
            ]
        }).lean();

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, props: Props) {
    const params = await props.params;
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await request.json();

        const article = await Article.findOneAndUpdate(
            {
                $or: [
                    { slug: params.slug },
                    { _id: params.slug.match(/^[0-9a-fA-F]{24}$/) ? params.slug : null }
                ]
            },
            body,
            { new: true }
        );

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: Props) {
    const params = await props.params;
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const article = await Article.findOneAndDelete({
            $or: [
                { slug: params.slug },
                { _id: params.slug.match(/^[0-9a-fA-F]{24}$/) ? params.slug : null }
            ]
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
