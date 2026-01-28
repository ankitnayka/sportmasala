import mongoose, { Schema, Model } from 'mongoose';

export interface IMatch {
    team1: string;
    team2: string;
    date: Date;
    venue: string;
    status: 'scheduled' | 'live' | 'completed';
    result?: string; // e.g., "India won by 10 runs"
    score?: string; // e.g., "IND 180/4 vs PAK 170/9"
    createdAt: Date;
    updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>({
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
    result: { type: String },
    score: { type: String },
}, {
    timestamps: true,
});

const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

export default Match;
