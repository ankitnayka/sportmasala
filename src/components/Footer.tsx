import Link from 'next/link';
import Match from '@/models/Match';
import TrendingTopic from '@/models/TrendingTopic';
import dbConnect from '@/lib/db';
import { format } from 'date-fns';

export default async function Footer() {
    await dbConnect();

    // Fetch Data for dynamic columns
    const trendingLeagues = await TrendingTopic.find({ isActive: true }).sort({ priority: 1 }).limit(6);
    const upcomingMatches = await Match.find({ status: 'scheduled' }).sort({ date: 1 }).limit(5);

    return (
        <footer className="bg-zinc-950 text-white border-t border-zinc-800 mt-auto pt-12 pb-8">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-accent transition">Home</Link></li>
                            <li><Link href="/schedule" className="hover:text-accent transition">Schedule</Link></li>
                            <li><Link href="/video" className="hover:text-accent transition">Visual Stories</Link></li>
                            <li><Link href="/polls" className="hover:text-accent transition">Polls</Link></li>
                            <li><Link href="/cricket" className="hover:text-accent transition">Cricket News</Link></li>
                            <li><Link href="/photos" className="hover:text-accent transition">Photos</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Top Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Top Categories</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/cricket" className="hover:text-accent transition">Cricket</Link></li>
                            <li><Link href="/football" className="hover:text-accent transition">Football</Link></li>
                            <li><Link href="/tennis" className="hover:text-accent transition">Tennis</Link></li>
                            <li><Link href="/kabaddi" className="hover:text-accent transition">Kabaddi</Link></li>
                            <li><Link href="/basket-ball" className="hover:text-accent transition">Basketball</Link></li>
                            <li><Link href="/motor-sports" className="hover:text-accent transition">Motor Sports</Link></li>
                            <li><Link href="/wwe" className="hover:text-accent transition">WWE</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Top Leagues (Dynamic) */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Top Leagues</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {trendingLeagues.map(topic => (
                                <li key={topic._id.toString()}>
                                    <Link href={`/topic/${topic.slug}`} className="hover:text-accent transition">
                                        {topic.name}
                                    </Link>
                                </li>
                            ))}
                            {trendingLeagues.length === 0 && <li>No active leagues</li>}
                        </ul>
                    </div>

                    {/* Column 4: Schedule (Dynamic) */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Schedule</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {upcomingMatches.map(match => (
                                <li key={match._id.toString()}>
                                    <Link href="/schedule" className="hover:text-accent transition group block">
                                        <span className="block text-white font-medium group-hover:text-accent">
                                            {match.team1} vs {match.team2}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {format(new Date(match.date), 'MMM d, h:mm a')}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                            {upcomingMatches.length === 0 && <li>No upcoming matches.</li>}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} T20 Masala. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/about" className="hover:text-white">About Us</Link>
                        <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
                        <Link href="/contact" className="hover:text-white">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
