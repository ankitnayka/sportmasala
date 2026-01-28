import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Upsert logic: Update if exists, Insert if not
        const adminUser = await User.findOneAndUpdate(
            { email: 'admin@t20masala.com' },
            {
                username: 'SuperAdmin',
                email: 'admin@t20masala.com',
                mobile: '9999999999',
                password: hashedPassword,
                role: 'super_admin',
                isActive: true,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ message: 'Super Admin Reset/Created', user: adminUser });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
