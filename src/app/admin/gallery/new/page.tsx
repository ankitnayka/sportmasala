import GalleryForm from '@/components/admin/GalleryForm';

export default function NewGalleryPage() {
    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Create New Photo Gallery</h1>
            <GalleryForm />
        </div>
    );
}
