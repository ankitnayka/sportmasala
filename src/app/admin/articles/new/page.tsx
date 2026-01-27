import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
            <ArticleForm />
        </div>
    );
}
