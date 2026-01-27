import { getArticles } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import MatchTicker from "@/components/MatchTicker";
import EditorsChoice from "@/components/EditorsChoice";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default async function Home() {
  const articles = await getArticles();

  // Assuming first 4 for Editors Choice
  const editorsChoiceArticles = articles?.slice(0, 4) || [];
  const webStories = articles?.slice(4, 8) || []; // Mock web stories from articles
  const latestNews = articles?.slice(8) || [];

  return (
    <div className="bg-[#121212] min-h-screen">
      {/* Match Ticker */}
      <MatchTicker />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">

        {/* Top Ad */}
        <AdPlaceholder slot="header" className="mb-8" />

        <div className="flex flex-col xl:flex-row gap-8">

          {/* Main Content Area (Left) */}
          <div className="flex-1 min-w-0">

            {/* Editors Choice Section */}
            <EditorsChoice articles={editorsChoiceArticles} />

            {/* Web Stories Strip (Mock) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-lime-500 rounded-sm"></span>
                  Web Stories
                </h2>
                <Link href="/stories" className="text-lime-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  View All <MoveRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {webStories.map((story, i) => (
                  <div key={i} className="flex-shrink-0 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-700">
                    {/* Placeholder Image */}
                    <div className={`absolute inset-0 ${i % 2 === 0 ? 'bg-purple-900' : 'bg-blue-900'}`}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-xs font-bold leading-tight line-clamp-3">{story.title}</p>
                    </div>
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full border-2 border-lime-500 bg-black flex items-center justify-center">
                      <div className="h-2 w-2 bg-lime-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News Grid */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-lime-500 rounded-sm"></span>
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestNews.map(article => (
                  <NewsCard key={article.slug} article={article} />
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-[350px] space-y-6">
            {/* Ad Unit */}
            <AdPlaceholder slot="sidebar" />

            {/* Points Table Widget (Static Mock) */}
            <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden">
              <div className="bg-[#252525] px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase">Points Table</h3>
                <select className="bg-black text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none">
                  <option>IPL 2026</option>
                </select>
              </div>
              <table className="w-full text-xs text-left text-gray-400">
                <thead className="bg-[#2a2a2a] text-gray-200">
                  <tr>
                    <th className="px-3 py-2">Team</th>
                    <th className="px-2 py-2 text-center">M</th>
                    <th className="px-2 py-2 text-center">W</th>
                    <th className="px-2 py-2 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { name: 'CSK', m: 14, w: 10, pts: 20 },
                    { name: 'MI', m: 14, w: 9, pts: 18 },
                    { name: 'RCB', m: 14, w: 8, pts: 16 },
                    { name: 'KKR', m: 14, w: 7, pts: 14 },
                  ].map((team, idx) => (
                    <tr key={team.name} className="hover:bg-[#252525]">
                      <td className="px-3 py-3 flex items-center gap-2 font-bold text-white">
                        <span className="text-gray-600">{idx + 1}</span> {team.name}
                      </td>
                      <td className="px-2 py-3 text-center">{team.m}</td>
                      <td className="px-2 py-3 text-center">{team.w}</td>
                      <td className="px-2 py-3 text-center font-bold text-white">{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-[#252525] text-center border-t border-gray-800">
                <Link href="/schedule" className="text-lime-500 text-xs font-bold hover:underline">View Full Table</Link>
              </div>
            </div>

            {/* Featured Video (Static Mock) */}
            <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden">
              <div className="relative aspect-video bg-black group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
                    <div className="h-10 w-10 rounded-full bg-lime-500 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-black border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white text-sm font-bold truncate">Exclusive: Interview with Captain</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
