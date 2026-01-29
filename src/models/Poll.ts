import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPollOption {
    _id?: string;
    text: string;
    votes: number;
}

export interface IPoll extends Document {
    question: string;
    options: IPollOption[];
    status: "active" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const PollSchema: Schema<IPoll> = new Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
        },
        options: [
            {
                text: { type: String, required: true },
                votes: { type: Number, default: 0 },
            },
        ],
        status: {
            type: String,
            enum: ["active", "closed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Helper to ensure model isn't recompiled in dev mode
const Poll: Model<IPoll> =
    mongoose.models.Poll || mongoose.model<IPoll>("Poll", PollSchema);

export default Poll;
