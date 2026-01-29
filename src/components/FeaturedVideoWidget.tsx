"use client";

import { useEffect, useState } from "react";

interface FeaturedVideoData {
    videoId: string;
    title: string;
    isActive: boolean;
}

export default function FeaturedVideoWidget() {
    const [video, setVideo] = useState<FeaturedVideoData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await fetch("/api/featured-video", { cache: "no-store" });
                const data = await res.json();
                if (data.success && data.video && data.video.isActive) {
                    setVideo(data.video);
                }
            } catch (error) {
                console.error("Error fetching featured video:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, []);

    if (loading) return null; // Or a skeleton if preferred, but usually cleaner to show nothing until ready
    if (!video) return null;

    return (
        <div className="bg-card border rounded-lg overflow-hidden shadow-sm mb-6">
            <div className="p-4 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-600 rounded-full"></span>
                    Featured Video
                </h3>
            </div>
            <div className="relative pb-[56.25%] h-0 bg-black">
                <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=1&rel=0`}
                    className="absolute top-0 left-0 w-full h-full"
                    title={video.title || "Featured Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            {video.title && (
                <div className="p-3 bg-muted/30">
                    <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                </div>
            )}
        </div>
    );
}
