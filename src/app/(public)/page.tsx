import { getArticles } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import EditorsChoice from "@/components/EditorsChoice";
import WebStory from "@/models/WebStory";
import dbConnect from "@/lib/db";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import FeaturedSeriesWidget from "@/components/FeaturedSeriesWidget";

export default async function Home() {
  await dbConnect();

  // Fetch Articles and Stories in parallel for performance
  const [articles, webStoriesData] = await Promise.all([
    getArticles(),
    WebStory.find({ isPublished: true }).sort({ createdAt: -1 }).limit(10)
  ]);

  // Assuming first 4 for Editors Choice
  const editorsChoiceArticles = articles?.slice(0, 4) || [];
  // Use real web stories
  const webStories = webStoriesData || [];
  const latestNews = articles?.slice(4) || []; // Adjusted slice since we aren't using 4 for stories anymore

  return (
    <div className="bg-[#121212] min-h-screen">

      <div className="w-full py-6">

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
                <Link href="/web-stories" className="text-lime-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  View All <MoveRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {webStories.map((story: any, i: number) => (
                  <Link href={`/web-stories/${story.slug}`} key={story._id || i} className="flex-shrink-0 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-700 hover:border-lime-500 transition-colors">
                    {/* Cover Image */}
                    {story.coverImage && (
                      <img src={story.coverImage} alt={story.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80"></div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-xs font-bold leading-tight line-clamp-3 group-hover:text-lime-400 transition-colors">{story.title}</p>
                    </div>

                    {/* Icon */}
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full border-2 border-lime-500 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="h-2 w-2 bg-lime-500 rounded-full animate-ping"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest News Grid */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-lime-500 rounded-sm"></span>
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {latestNews.slice(0, 8).map((article, index) => (
                  <div key={article.slug} className={index >= 3 ? 'hidden md:block' : ''}>
                    <NewsCard article={article} />
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  href="/cricket"
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold py-3 px-8 rounded-full border border-zinc-700 transition flex items-center gap-2 group"
                >
                  View All News
                  <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-[350px] space-y-6">
            {/* Ad Unit */}
            <AdPlaceholder slot="sidebar" />

            {/* Points Table Widget (Static Mock) */}
            {/* Featured Series Stats Widget */}
            <FeaturedSeriesWidget />

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
    </div >
  );
}
