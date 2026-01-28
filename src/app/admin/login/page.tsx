'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
                // Force a refresh to update server components/middleware state if needed
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleLogin} className="bg-zinc-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
                    <p className="text-zinc-400 text-sm">Secure access for T20 Masala</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@t20masala.com"
                            className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded text-white focus:outline-none focus:border-red-600 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded text-white focus:outline-none focus:border-red-600 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white font-bold p-3 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </div>

                <div className="mt-6 text-center text-xs text-zinc-500">
                    <p>Default: admin@t20masala.com / admin123</p>
                    <p className="mt-1 opacity-50">(Run /api/seed-admin if first time)</p>
                </div>
            </form>
        </div>
    );
}
