import mongoose, { Schema, Model } from 'mongoose';

export interface IArticle {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: 'Cricket' | 'Football' | 'World' | 'Politics';
    author: string;
    tags?: string[];
    imageUrl?: string;
    status: 'draft' | 'published';
    views: number;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose automatically creates _id, so we don't need to define it in interface if we extend Document
// But for client use, we just want the plain shape usually.

const ArticleSchema = new Schema<IArticle>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, enum: ['Cricket', 'Football', 'World', 'Politics'] },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    imageUrl: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, // adds createdAt and updatedAt
});

// Avoid OverwriteModelError upon hot reload
const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
