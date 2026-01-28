import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    mobile: string;
    password: string; // Hashed
    role: 'super_admin' | 'sub_admin';
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'sub_admin'], default: 'sub_admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, {
    timestamps: true,
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
