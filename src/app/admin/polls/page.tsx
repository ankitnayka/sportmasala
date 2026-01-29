"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";

interface PollOption {
    _id: string;
    text: string;
    votes: number;
}

interface Poll {
    _id: string;
    question: string;
    options: PollOption[];
    status: string;
    createdAt: string;
}

export default function AdminPollsPage() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]); // Default 2 options
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const res = await fetch("/api/polls");
            const data = await res.json();
            if (data.success) {
                setPolls(data.polls);
            }
        } catch (error) {
            console.error("Error fetching polls:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, ""]);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        if (options.some((opt) => !opt.trim())) {
            alert("All options must be filled");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/polls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, options }),
            });
            const data = await res.json();
            if (data.success) {
                setQuestion("");
                setOptions(["", ""]);
                fetchPolls();
            }
        } catch (error) {
            console.error("Error creating poll:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const deletePoll = async (id: string) => {
        if (!confirm("Are you sure you want to delete this poll?")) return;
        try {
            const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setPolls(polls.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error("Error deleting poll:", error);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Manage Polls</h1>

            {/* Create Poll Form */}
            <div className="bg-card border border-card-border p-8 rounded-xl shadow-lg transition-colors">
                <h2 className="text-xl font-bold mb-6 text-foreground">Create New Poll</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 opacity-70">Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                            placeholder="e.g. Who will win today's match?"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium opacity-70">Options</label>
                        {options.map((opt, index) => (
                            <div key={index} className="flex gap-3">
                                <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="flex-1 px-4 py-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                    placeholder={`Option ${index + 1}`}
                                    required
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {options.length < 6 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="flex items-center gap-2 text-sm font-bold text-accent hover:opacity-80 transition-opacity pt-1"
                            >
                                <Plus size={16} /> Add Option
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-8 py-3 bg-accent text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Creating...
                            </>
                        ) : (
                            "Create Poll"
                        )}
                    </button>
                </form>
            </div>

            {/* Polls List */}
            <div className="bg-card border border-card-border p-8 rounded-xl shadow-lg transition-colors">
                <h2 className="text-xl font-bold mb-6 text-foreground">Active Polls</h2>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-accent" size={40} />
                    </div>
                ) : polls.length === 0 ? (
                    <div className="text-center py-12 opacity-40 italic">
                        No active polls found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {polls.map((poll) => (
                            <div key={poll._id} className="bg-background border border-card-border p-6 rounded-xl space-y-4 hover:border-accent/30 transition-all group">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors">{poll.question}</h3>
                                    <button
                                        onClick={() => deletePoll(poll._id)}
                                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete Poll"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {poll.options.map((opt) => {
                                        const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
                                        const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                                        return (
                                            <div key={opt._id} className="space-y-1.5">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="opacity-80">{opt.text}</span>
                                                    <span className="text-foreground/40">{opt.votes} votes</span>
                                                </div>
                                                <div className="h-2 w-full bg-accent/5 rounded-full overflow-hidden border border-card-border/50">
                                                    <div
                                                        className="h-full bg-accent transition-all duration-1000"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="text-xs font-bold text-foreground/30 pt-2 uppercase tracking-widest text-right">
                                        Total: {poll.options.reduce((sum, opt) => sum + opt.votes, 0)} Votes
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
