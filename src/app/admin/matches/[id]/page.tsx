import MatchForm from "@/components/admin/MatchForm";
import dbConnect from "@/lib/db";
import Match from "@/models/Match";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditMatchPage(props: Props) {
    const params = await props.params;
    await dbConnect();
    const match = await Match.findById(params.id);

    if (!match) {
        notFound();
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Match</h1>
            {/* Serialize MongoDB object to plain JSON to avoid warnings passed to client component */}
            <MatchForm initialData={JSON.parse(JSON.stringify(match))} isEdit={true} />
        </div>
    );
}
