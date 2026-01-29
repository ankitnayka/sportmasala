import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FeaturedVideo from "@/models/FeaturedVideo";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        // Fetch the most recently updated active video
        const video = await FeaturedVideo.findOne({ isActive: true }).sort({ updatedAt: -1 });
        return NextResponse.json({ success: true, video });
    } catch (error) {
        console.error("Error fetching featured video:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch video" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { videoUrl, isActive, title } = body;

        // Basic YouTube ID extraction
        let videoId = "";
        if (videoUrl) {
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = videoUrl.match(regex);
            if (match && match[1]) {
                videoId = match[1];
            }
        }

        if (!videoId && isActive) {
            return NextResponse.json(
                { success: false, error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        // Upsert logic: We essentially only want one "current" configuration primarily.
        // For simplicity, we can just create a new one every time to keep history, or update the latest.
        // Let's create new to keep history, but deactivate others if this one is active.

        if (isActive) {
            await FeaturedVideo.updateMany({}, { isActive: false });
        }

        const video = await FeaturedVideo.create({
            videoId,
            title,
            isActive
        });

        return NextResponse.json({ success: true, video });
    } catch (error) {
        console.error("Error saving featured video:", error);
        return NextResponse.json(
            { success: false, error: "Failed to save video" },
            { status: 500 }
        );
    }
}
