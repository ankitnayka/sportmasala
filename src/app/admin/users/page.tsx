'use client';

import { useEffect, useState } from 'react';
import { Users, Trash2, Plus, Shield } from 'lucide-react';

interface IUser {
    _id: string;
    username: string;
    email: string;
    mobile: string;
    role: 'super_admin' | 'sub_admin';
    isActive: boolean;
}

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New User Form
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        password: '',
        role: 'sub_admin' // Default to sub_admin
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users'); // We need to create this API
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                // If 401/403, maybe redirect or show error
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newUser = await res.json();
                setUsers([...users, newUser]);
                setShowForm(false);
                setFormData({ username: '', email: '', mobile: '', password: '', role: 'sub_admin' });
            } else {
                const err = await res.json();
                alert('Error: ' + err.error);
            }
        } catch (error) {
            console.error('Create error', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('Delete error', error);
        }
    };

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                    <Users className="text-accent" size={32} />
                    User Management
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-accent text-white px-6 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
                >
                    <Plus size={18} /> Add New User
                </button>
            </div>

            {showForm && (
                <div className="bg-card border border-card-border p-8 rounded-2xl shadow-xl transition-all animate-in slide-in-from-top duration-300">
                    <h2 className="text-xl font-bold mb-6 text-foreground">Create New Admin</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold opacity-40 uppercase ml-1">Username</label>
                            <input
                                type="text"
                                placeholder="e.g. admin_josh"
                                required
                                className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold opacity-40 uppercase ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@t20masala.com"
                                required
                                className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold opacity-40 uppercase ml-1">Mobile Number</label>
                            <input
                                type="text"
                                placeholder="+91 ..."
                                required
                                className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold opacity-40 uppercase ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold opacity-40 uppercase ml-1">Role & Permissions</label>
                            <select
                                className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            >
                                <option value="sub_admin">Sub Admin (Can manage Content)</option>
                                <option value="super_admin">Super Admin (Can manage Everything)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-6 border-t border-card-border">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 text-foreground/50 hover:text-foreground font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-accent text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden transition-colors">
                <table className="min-w-full divide-y divide-card-border">
                    <thead className="bg-background/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">User Profile</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Contact Info</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Account Status</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-accent/5 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center font-bold text-lg shadow-sm">
                                            {(user.username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{user.username || 'Unknown User'}</div>
                                            <div className="text-[10px] font-mono opacity-30 mt-0.5">#{user._id.slice(-6).toUpperCase()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-foreground/70">{user.email}</div>
                                    <div className="text-xs text-foreground/30 mt-0.5">{user.mobile}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.role === 'super_admin' ? (
                                        <span className="px-3 py-1 inline-flex text-[10px] font-bold rounded-full bg-accent/10 text-accent border border-accent/20 items-center gap-1.5 uppercase tracking-wider">
                                            <Shield size={10} /> Super Admin
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 inline-flex text-[10px] font-bold rounded-full bg-foreground/5 text-foreground/50 border border-foreground/10 uppercase tracking-wider">
                                            Sub Admin
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-[10px] font-bold rounded-full border ${user.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} uppercase tracking-wider`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {user.role !== 'super_admin' && (
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
