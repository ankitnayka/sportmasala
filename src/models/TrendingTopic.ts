import mongoose, { Schema, Model } from 'mongoose';

export interface ITrendingTopic {
    name: string;        // Display Name (e.g. "WPL 2026")
    slug: string;        // URL part (e.g. "wpl-2026")
    searchQuery: string; // Internal tag to match articles (e.g. "wpl-2026")
    priority: number;    // 1 is highest priority (first in list)
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TrendingTopicSchema = new Schema<ITrendingTopic>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    searchQuery: { type: String, required: true },
    priority: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const TrendingTopic: Model<ITrendingTopic> = mongoose.models.TrendingTopic || mongoose.model<ITrendingTopic>('TrendingTopic', TrendingTopicSchema);

export default TrendingTopic;
