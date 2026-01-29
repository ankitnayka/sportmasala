"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface PollOption {
    _id: string;
    text: string;
    votes: number;
}

export interface Poll {
    _id: string;
    question: string;
    options: PollOption[];
}

export default function PollCard({ initialPoll }: { initialPoll?: Poll }) {
    const [poll, setPoll] = useState<Poll | null>(initialPoll || null);
    const [loading, setLoading] = useState(!initialPoll);
    const [votedOption, setVotedOption] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const res = await fetch("/api/polls", { cache: "no-store" });
                const data = await res.json();
                if (data.success && data.polls.length > 0) {
                    const latestPoll = data.polls[0];
                    setPoll(latestPoll);
                    checkVotedState(latestPoll._id);
                }
            } catch (error) {
                console.error("Error fetching poll:", error);
            } finally {
                setLoading(false);
            }
        };

        if (initialPoll) {
            checkVotedState(initialPoll._id);
        } else {
            fetchPoll();
        }
    }, [initialPoll]);

    const checkVotedState = (pollId: string) => {
        const voted = localStorage.getItem(`poll_voted_${pollId}`);
        if (voted) {
            setVotedOption(voted);
        }
    }

    const handleVote = async (optionId: string) => {
        if (!poll || submitting) return;
        if (votedOption === optionId) return;

        setSubmitting(true);

        try {
            const payload: { optionId: string; previousOptionId?: string } = { optionId };
            if (votedOption) {
                payload.previousOptionId = votedOption;
            }

            const res = await fetch(`/api/polls/${poll._id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setPoll(data.poll);
                setVotedOption(optionId);
                localStorage.setItem(`poll_voted_${poll._id}`, optionId);
            }
        } catch (error) {
            console.error("Error submitting vote:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!poll) return null;

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
        <div className="bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg">{poll.question}</h3>

            <div className="space-y-4">
                {poll.options.map((option) => {
                    const isVoted = votedOption === option._id;
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                    // Always show interaction possible unless submitting
                    // If voted, we show the bar but make it clickable to switch
                    return (
                        <div key={option._id} className="relative group cursor-pointer" onClick={() => !submitting && handleVote(option._id)}>
                            {!votedOption ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(option._id);
                                    }}
                                    disabled={submitting}
                                    className="w-full text-left px-4 py-3 rounded-md border bg-background hover:bg-muted transition-colors font-medium"
                                >
                                    {option.text}
                                </button>
                            ) : (
                                <div className={`relative w-full rounded-md border bg-background overflow-hidden transition-all ${!isVoted ? 'hover:border-primary/50' : ''}`}>
                                    {/* Background Progress Bar */}
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${isVoted ? "bg-green-500/20" : "bg-muted/30"
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />

                                    <div className="relative px-4 py-3 flex justify-between items-center z-10">
                                        <div className="flex items-center gap-2">
                                            {/* Radio circle visual for switching */}
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isVoted ? 'border-green-500' : 'border-muted-foreground/30'}`}>
                                                {isVoted && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                            </div>
                                            <span className={`font-medium ${isVoted ? "text-green-600 dark:text-green-400" : ""}`}>
                                                {option.text}
                                            </span>
                                        </div>
                                        <span className="font-bold text-sm">{percentage}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="text-xs text-muted-foreground pt-1 flex justify-between">
                <span>{totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}</span>
                {votedOption && <span className="text-[10px] opacity-70">Click another option to change vote</span>}
            </div>
        </div>
    );
}
