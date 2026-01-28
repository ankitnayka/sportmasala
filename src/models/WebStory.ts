import mongoose, { Schema, Document } from 'mongoose';

export interface ISlide {
    imageUrl: string;
    text?: string;
}

export interface IWebStory extends Document {
    title: string;
    slug: string;
    coverImage: string;
    slides: ISlide[];
    linkedArticleSlug?: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SlideSchema = new Schema({
    imageUrl: { type: String, required: true },
    text: { type: String, maxlength: 200 }
});

const WebStorySchema = new Schema<IWebStory>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String, required: true },
    slides: { type: [SlideSchema], validate: [(val: ISlide[]) => val.length > 0, 'Must have at least one slide'] },
    linkedArticleSlug: { type: String },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.WebStory || mongoose.model<IWebStory>('WebStory', WebStorySchema);
