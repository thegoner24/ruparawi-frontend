"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { getArticleById } from "../mock";


export default function SingleArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const data = getArticleById(params.id);
    if (data) {
      setArticle(data);
    } else {
      setError("Article not found.");
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-gray-500">Loading article...</div>;
  }
  if (error) {
    return <div className="flex flex-col gap-4 justify-center items-center h-96 text-red-500">
      <span>{error}</span>
      <Link href="/" className="text-[#bfa76a] underline">Back to Home</Link>
    </div>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/articles" className="text-[#bfa76a] text-sm mb-6 inline-block hover:underline">&larr; Back to Articles</Link>
      <article className="bg-white rounded-xl shadow p-6">
        {article.image && (
          <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded mb-6" />
        )}
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span>By {article.author}</span>
          <span>&bull;</span>
          <span>{article.date}</span>
        </div>
        <div className="prose max-w-none text-gray-800">
          {article.content}
        </div>
      </article>
    </main>
  );
}
