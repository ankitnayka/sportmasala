import React from 'react';

interface AdPlaceholderProps {
    slot: 'header' | 'sidebar' | 'in-article' | 'footer';
    className?: string;
}

export default function AdPlaceholder({ slot, className = '' }: AdPlaceholderProps) {
    // In development, show a gray box.
    // In production, this would contain the actual AdSense script.
    // Ideally, we conditionally render the script here.

    const getDimensions = () => {
        switch (slot) {
            case 'header': return 'h-[90px] w-full max-w-[728px]'; // Leaderboard
            case 'sidebar': return 'h-[600px] w-full'; // Skyscraper / Rectangle
            case 'in-article': return 'h-[250px] w-full'; // Rectangle
            case 'footer': return 'h-[50px] w-full'; // Mobile sticky
            default: return 'h-auto w-full';
        }
    };

    return (
        <div className={`flex justify-center items-center bg-[#1c1c1c] border border-gray-800 mx-auto my-4 ${getDimensions()} ${className}`}>
            <span className="text-xs text-gray-600 uppercase tracking-widest">Ad Space ({slot})</span>
        </div>
    );
}
