'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Password"
                    className="w-full border p-2 rounded mb-4"
                />
                <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
                    Login
                </button>
            </form>
        </div>
    );
}
