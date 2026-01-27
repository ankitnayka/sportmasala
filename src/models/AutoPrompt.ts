import mongoose from 'mongoose';

const AutoPromptSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this prompt'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Cricket', 'Football', 'World', 'Politics', 'Tennis', 'WWE'],
    },
    promptTemplate: {
        type: String,
        required: [true, 'Please provide a prompt template'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastRunAt: {
        type: Date,
    },
}, { timestamps: true });

export default mongoose.models.AutoPrompt || mongoose.model('AutoPrompt', AutoPromptSchema);
