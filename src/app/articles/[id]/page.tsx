"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getArticleById } from "../mock";

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Helper to render paragraphs from content with line breaks and section titles
const renderContent = (content: string) => {
  return content.split('\n\n').map((paragraph, idx) => {
    // Section titles (if all uppercase or matches your style)
    if (
      paragraph === paragraph.toUpperCase() &&
      paragraph.length < 40 &&
      /^[A-Z\s\-]+$/.test(paragraph)
    ) {
      return (
        <h2 key={idx} className="mt-10 mb-4 text-xl font-bold text-[#7C6A0A]">
          {paragraph}
        </h2>
      );
    }
    // Blockquote
    if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
      return (
        <blockquote key={idx} className="my-8 pl-4 border-l-2 border-black italic text-lg">
          {paragraph}
        </blockquote>
      );
    }
    // Regular paragraph
    return <p key={idx} className="my-6 text-gray-800 leading-relaxed">{paragraph}</p>;
  });
};

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
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-96 text-red-500">
        <span>{error}</span>
        <Link href="/" className="text-black underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pb-20 pt-12">
      {/* Back navigation */}
      <Link 
        href="/"
        className="inline-block mb-8 text-sm hover:underline text-gray-600"
      >
        ← Back to Home
      </Link>

      {/* Title and Tag */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">#RupaRupaRawi</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
      </div>

      {/* Date and Author */}
      <div className="flex items-center text-xs text-gray-500 uppercase tracking-wide mb-6">
        <span>{article.author}</span>
        <span className="mx-2">•</span>
        <span>{formatDate(article.date)}</span>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="mb-10">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="prose max-w-none">
        {renderContent(article.content)}
      </article>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 text-sm text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
