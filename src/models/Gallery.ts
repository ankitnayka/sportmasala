import mongoose, { Schema, Model } from 'mongoose';

export interface IGalleryPhoto {
    url: string;
    description: string;
}

export interface IGallery {
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    photos: IGalleryPhoto[];
    status: 'draft' | 'published';
    author: string;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true }, // Main gallery description
    thumbnail: { type: String, required: true },
    photos: [{
        url: { type: String, required: true },
        description: { type: String }
    }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// Avoid OverwriteModelError upon hot reload
const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
