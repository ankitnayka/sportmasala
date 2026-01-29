import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { optionId, previousOptionId } = body;

        if (!optionId) {
            return NextResponse.json(
                { success: false, error: "Option ID is required" },
                { status: 400 }
            );
        }

        let poll;

        if (previousOptionId && previousOptionId !== optionId) {
            // User is changing their vote
            // We need to atomically decrement the old vote and increment the new one
            // Since MongoDB doesn't support updating two different array elements by query in one go easily without arrayFilters,
            // and arrayFilters can be complex, we'll try a bulkWrite or two operations.
            // Given the scale, two operations is acceptable, or we can use the specific index if we knew it, but we don't.

            // Let's use two updates for simplicity and reliability

            // 1. Decrement previous
            await Poll.updateOne(
                { _id: id, "options._id": previousOptionId },
                { $inc: { "options.$.votes": -1 } }
            );

            // 2. Increment new
            poll = await Poll.findOneAndUpdate(
                { _id: id, "options._id": optionId },
                { $inc: { "options.$.votes": 1 } },
                { new: true }
            );

        } else {
            // New vote
            poll = await Poll.findOneAndUpdate(
                { _id: id, "options._id": optionId },
                { $inc: { "options.$.votes": 1 } },
                { new: true }
            );
        }

        if (!poll) {
            // If poll is null because we did the two-step update, we need to fetch it to return it
            poll = await Poll.findById(id);
        }

        if (!poll) {
            return NextResponse.json(
                { success: false, error: "Poll not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, poll });
    } catch (error) {
        console.error("Error submitting vote:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit vote" },
            { status: 500 }
        );
    }
}
