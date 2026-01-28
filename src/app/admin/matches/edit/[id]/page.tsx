'use client';

import { use, useEffect, useState } from 'react';
import MatchForm from "@/components/admin/MatchForm";

export default function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await fetch(`/api/matches/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMatch(data);
                } else {
                    console.error("Match not found");
                }
            } catch (error) {
                console.error("Error fetching match", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMatch();
        }
    }, [id]);

    if (loading) return <div className="p-8">Loading match details...</div>;
    if (!match) return <div className="p-8">Match not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Edit Match</h1>
            <MatchForm initialData={match} isEdit={true} />
        </div>
    );
}
