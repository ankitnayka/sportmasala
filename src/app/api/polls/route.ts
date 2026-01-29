import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const polls = await Poll.find({ status: "active" }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, polls });
    } catch (error) {
        console.error("Error fetching polls:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch polls" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { question, options } = body;

        if (!question || !options || !Array.isArray(options) || options.length < 2 || options.length > 6) {
            return NextResponse.json(
                { success: false, error: "Invalid data. Question and 2-6 options are required." },
                { status: 400 }
            );
        }

        const formattedOptions = options.map((opt: string) => ({
            text: opt,
            votes: 0,
        }));

        const poll = await Poll.create({
            question,
            options: formattedOptions,
            status: "active",
        });

        return NextResponse.json({ success: true, poll }, { status: 201 });
    } catch (error) {
        console.error("Error creating poll:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create poll" },
            { status: 500 }
        );
    }
}
