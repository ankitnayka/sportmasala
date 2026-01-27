import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AutoPrompt from '@/models/AutoPrompt';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const updated = await AutoPrompt.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        await AutoPrompt.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
