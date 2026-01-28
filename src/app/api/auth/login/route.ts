import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // 1. Find User by Email (or Username if we wanted)
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Check Password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Check Active Status
        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is inactive. Contact Super Admin.' }, { status: 403 });
        }

        // 4. Create Session
        await createSession({
            _id: user._id.toString(),
            role: user.role,
            email: user.email,
            username: user.username
        });

        // Update Last Login
        user.lastLogin = new Date();
        await user.save();

        return NextResponse.json({ success: true, role: user.role });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
