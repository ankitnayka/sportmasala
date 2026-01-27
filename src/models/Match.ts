import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
        enum: ['Cricket', 'Football', 'Other'],
    },
    series: {
        type: String, // e.g., "ICC T20 WC", "Premier League"
        required: true,
    },
    team1: {
        type: String, // Name or Abbreviation
        required: true,
    },
    team2: {
        type: String,
        required: true,
    },
    team1Score: {
        type: String, // "180/4 (20.0)"
        default: '',
    },
    team2Score: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Ended'],
        default: 'Upcoming',
    },
    result: {
        type: String, // "India won by 10 runs"
        default: '',
    },
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);
