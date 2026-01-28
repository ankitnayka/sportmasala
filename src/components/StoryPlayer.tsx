'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, X, Share2, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Slide {
    imageUrl: string;
    text?: string;
}

interface StoryPlayerProps {
    title: string;
    slides: Slide[];
    linkedArticleSlug?: string;
    closeLink?: string;
}

export default function StoryPlayer({ title, slides, linkedArticleSlug, closeLink = '/web-stories' }: StoryPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    // Navigation
    const nextSlide = useCallback(() => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (linkedArticleSlug) {
            // If linked article exists, go there on finish
            router.push(`/article/${linkedArticleSlug}`);
        } else {
            // Else go back to list
            router.push(closeLink);
        }
    }, [currentIndex, slides.length, linkedArticleSlug, router, closeLink]);

    const prevSlide = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') router.push(closeLink);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, router, closeLink]);

    const currentSlide = slides[currentIndex];
    const isLastSlide = currentIndex === slides.length - 1;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            {/* Desktop Background Blur */}
            <div className="absolute inset-0 hidden md:block opacity-30">
                <Image
                    src={currentSlide.imageUrl}
                    alt="Background"
                    fill
                    className="object-cover blur-3xl"
                />
            </div>

            {/* Mobile Story Container (9:16 Aspect) */}
            <div className="relative w-full h-full md:max-h-[85vh] md:max-w-[48vh] md:rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">

                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 z-30 p-2 flex gap-1">
                    {slides.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-white transition-all duration-300 ${idx < currentIndex ? 'w-full' :
                                        idx === currentIndex ? 'w-full animate-progress' : 'w-0'
                                    }`}
                                // Note: Simple CSS animation won't strictly time it precisely without more complex logic, 
                                // but for manual navigation, full width on active/past is standard.
                                style={{ width: idx <= currentIndex ? '100%' : '0%' }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Header Controls */}
                <div className="absolute top-4 left-0 right-0 z-30 px-4 flex justify-between items-start pt-4 text-white drop-shadow-md">
                    <div className="flex items-center gap-2">
                        {/* Use logo or fallback */}
                        <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center font-bold text-black text-[10px]">TM</div>
                        <span className="text-xs font-bold opacity-90 truncate max-w-[150px]">{title}</span>
                    </div>
                    <div className="flex gap-4">
                        {/* Placeholder for Share/Mute features if needed */}
                        <Link href={closeLink} className="p-1 hover:bg-white/20 rounded-full transition">
                            <X size={24} />
                        </Link>
                    </div>
                </div>

                {/* Main Content Layer */}
                <div className="absolute inset-0">
                    <Image
                        src={currentSlide.imageUrl}
                        alt={currentSlide.text || title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vh"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                {/* Click Areas (Invisible) */}
                <div className="absolute inset-0 z-20 flex">
                    <div className="w-1/3 h-full" onClick={prevSlide}></div>
                    <div className="w-2/3 h-full" onClick={nextSlide}></div>
                </div>

                {/* Text & CTA Layer */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-6 pb-12 flex flex-col items-center text-center pointer-events-none">

                    {currentSlide.text && (
                        <div className="mb-6 animate-fade-in-up">
                            <p className={`text-white font-bold leading-snug drop-shadow-lg ${currentSlide.text.length > 100 ? 'text-lg' : 'text-2xl'}`}>
                                {currentSlide.text}
                            </p>
                        </div>
                    )}

                    {/* Final Slide CTA */}
                    {isLastSlide && linkedArticleSlug && (
                        <div className="w-full animate-bounce-short pointer-events-auto">
                            <Link
                                href={`/article/${linkedArticleSlug}`}
                                className="block w-full bg-white text-black font-bold py-4 rounded-full shadow-lg hover:bg-lime-400 transition flex items-center justify-center gap-2 group"
                            >
                                Read Full Article <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="text-white/60 text-[10px] mt-2 font-medium uppercase tracking-widest">Swipe Up</div>
                        </div>
                    )}

                    {/* Swipe Up Hint (Visual only as we use tap nav predominantly on web) */}
                    {!isLastSlide && (
                        <div className="mt-4 animate-bounce opacity-50">
                            <div className="w-1 h-12 bg-gradient-to-t from-white to-transparent rounded-full mx-auto"></div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
