"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Video } from "lucide-react";

export default function AdminFeaturedVideoPage() {
    const [videoUrl, setVideoUrl] = useState("");
    const [title, setTitle] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState("");

    useEffect(() => {
        fetchVideo();
    }, []);

    const fetchVideo = async () => {
        try {
            const res = await fetch("/api/featured-video");
            const data = await res.json();
            if (data.success && data.video) {
                setVideoUrl(`https://www.youtube.com/watch?v=${data.video.videoId}`);
                setTitle(data.video.title || "");
                setIsActive(data.video.isActive);
                setCurrentVideoId(data.video.videoId);
            }
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setLoading(false);
        }
    };

    const extractVideoId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/featured-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoUrl, title, isActive }),
            });
            const data = await res.json();
            if (data.success) {
                setCurrentVideoId(data.video.videoId);
                alert("Featured video updated successfully!");
            } else {
                alert(data.error || "Failed to update video");
            }
        } catch (error) {
            console.error("Error updating video:", error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const previewId = extractVideoId(videoUrl);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Video className="w-8 h-8 text-primary" />
                Featured Video Manager
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-card border border-card-border p-8 rounded-2xl shadow-lg h-fit transition-colors">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 opacity-70">YouTube URL</label>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                placeholder="https://www.youtube.com/watch?v=..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 opacity-70">Title (Optional)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-hidden transition-all"
                                placeholder="Video Title"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2 group">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-5 h-5 rounded border-card-border accent-accent cursor-pointer"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold opacity-70 cursor-pointer group-hover:text-accent transition-colors">
                                Set as Active (Visible on Home Page)
                            </label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-accent text-white rounded-xl font-bold font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview */}
                <div className="bg-card border border-card-border p-8 rounded-2xl shadow-lg transition-colors">
                    <h2 className="text-xl font-bold mb-6 text-foreground">Preview</h2>
                    {previewId ? (
                        <div className="space-y-6">
                            <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black shadow-2xl border border-card-border">
                                <iframe
                                    src={`https://www.youtube.com/embed/${previewId}`}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="text-sm p-5 bg-background border border-card-border rounded-xl shadow-inner">
                                <p className="flex items-center gap-2">
                                    <strong className="opacity-50 font-bold uppercase tracking-widest text-[10px]">Status:</strong>
                                    {isActive ? <span className="text-green-500 font-bold">Active</span> : <span className="text-red-500 font-bold">Inactive</span>}
                                </p>
                                <p className="mt-2 text-foreground/60 italic leading-relaxed">This video will {isActive ? "appear" : "NOT appear"} on the homepage.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-background rounded-2xl border-2 border-dashed border-card-border">
                            <Video className="w-16 h-16 text-foreground opacity-10 mb-4" />
                            <p className="text-foreground/30 font-medium">Enter a valid YouTube URL to preview</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
