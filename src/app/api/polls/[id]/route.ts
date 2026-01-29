import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedPoll = await Poll.findByIdAndDelete(id);

        if (!deletedPoll) {
            return NextResponse.json(
                { success: false, error: "Poll not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Poll deleted successfully" });
    } catch (error) {
        console.error("Error deleting poll:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete poll" },
            { status: 500 }
        );
    }
}
