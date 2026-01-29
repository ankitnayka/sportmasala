import Poll from "@/models/Poll";
import dbConnect from "@/lib/db";
import PollCard from "@/components/PollCard";
import AdPlaceholder from "@/components/AdPlaceholder";

export const dynamic = 'force-dynamic';

export default async function PollsPage() {
    await dbConnect();

    // Fetch all polls, sorted by newest first
    // Note: We need to serialize the Mongoose document to a plain object to pass to client component
    const pollsData = await Poll.find({ status: "active" }).sort({ createdAt: -1 });

    const polls = JSON.parse(JSON.stringify(pollsData));

    return (
        <div className="bg-[#121212] min-h-screen py-6">
            <div className="mb-8">
                <AdPlaceholder slot="header" />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-6 flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1 h-6 bg-lime-500 rounded-sm"></span>
                            All Polls
                        </h1>
                    </div>

                    {polls.length === 0 ? (
                        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                            <p className="text-gray-400">No active polls available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {polls.map((poll: any) => (
                                <div key={poll._id}>
                                    <PollCard initialPoll={poll} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Space (Optional, reusing layout sidebar but maybe want extra ads here) */}
                <div className="w-full md:w-[300px] hidden lg:block">
                    <AdPlaceholder slot="sidebar" />
                </div>
            </div>
        </div>
    );
}
