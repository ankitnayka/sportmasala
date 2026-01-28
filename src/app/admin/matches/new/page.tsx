'use client';

import MatchForm from "@/components/admin/MatchForm";

export default function NewMatchPage() {
    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Schedule New Match</h1>
            <MatchForm />
        </div>
    );
}
