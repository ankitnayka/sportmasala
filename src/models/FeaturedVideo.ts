import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeaturedVideo extends Document {
    videoId: string;
    title?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FeaturedVideoSchema: Schema<IFeaturedVideo> = new Schema(
    {
        videoId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const FeaturedVideo: Model<IFeaturedVideo> =
    mongoose.models.FeaturedVideo || mongoose.model<IFeaturedVideo>("FeaturedVideo", FeaturedVideoSchema);

export default FeaturedVideo;
