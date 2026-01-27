'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: (url: string) => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            onChange(data.url);
        } catch (error: any) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value ? (
                    <div className="relative w-[200px] h-[120px] rounded-md overflow-hidden border border-gray-200">
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                type="button"
                                onClick={() => onRemove(value)}
                                className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                        {/* Using Next Image for optimization, but standard img for simplicity in preview if domain not whitelisted yet */}
                        <img // Using img tag initially to avoid domain config issues during dev setup
                            src={value}
                            alt="Uploaded Image"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="w-[200px] h-[120px] bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-xs">No image</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <label className={`
            flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-800 transition
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input
                        type="file"
                        disabled={isUploading}
                        onChange={onUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </label>
                {value && (
                    <input
                        value={value}
                        disabled
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-500 text-xs p-2 rounded truncate"
                    />
                )}
            </div>
        </div>
    );
}
