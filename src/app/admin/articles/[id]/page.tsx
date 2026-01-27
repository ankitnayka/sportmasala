'use client';

import ArticleForm from "@/components/admin/ArticleForm";
import { useEffect, useState, use } from "react";

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: Props) {
    // Unwrap params using React.use()
    const { id } = use(params);
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetch(`/api/articles/${id}`)
            .then(res => res.json())
            .then(data => setArticle(data));
    }, [id]);

    if (!article) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
            <ArticleForm initialData={article} isEdit={true} />
        </div>
    );
}
