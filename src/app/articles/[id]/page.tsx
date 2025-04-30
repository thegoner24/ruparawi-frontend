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

// Helper to render paragraphs from content with line breaks
const renderContent = (content: string) => {
  return content.split('\n\n').map((paragraph, idx) => {
    // Check if paragraph is a list
    if (paragraph.startsWith('- ') || paragraph.startsWith('• ')) {
      const items = paragraph.split('\n').map(item => 
        item.replace(/^-\s+|•\s+/, '')
      );
      return (
        <ul key={idx} className="my-6 list-disc pl-6 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-gray-800">{item}</li>
          ))}
        </ul>
      );
    }
    
    // Check if paragraph is numbered list
    if (/^\d+\.\s/.test(paragraph)) {
      const items = paragraph.split('\n').map(item => 
        item.replace(/^\d+\.\s+/, '')
      );
      return (
        <ol key={idx} className="my-6 list-decimal pl-6 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-gray-800">{item}</li>
          ))}
        </ol>
      );
    }
    
    // Check if it's a quote
    if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
      return (
        <blockquote key={idx} className="my-8 pl-4 border-l-2 border-black italic text-xl">
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
        <Link href="/articles" className="text-black underline">Back to Articles</Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 pb-20 pt-12">
      {/* Navigation */}
      <Link 
        href="/articles" 
        className="inline-block mb-12 text-sm hover:underline text-gray-600"
      >
        ← Back to Articles
      </Link>
      
      {/* Article Content */}
      <article className="mx-auto">
        {/* Title with Tag */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">#RupaRupaRawi</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
        </div>
        
        {/* Featured Image */}
        {article.image && (
          <div className="mb-10">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto object-cover" 
            />
          </div>
        )}
        
        {/* Author and Date */}
        <div className="flex items-center text-sm text-gray-500 uppercase tracking-wide mb-10">
          <span>{article.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.date)}</span>
        </div>
        
        {/* Article Content */}
        <div className="prose max-w-none">
          {renderContent(article.content)}
        </div>
        
        {/* Tags if available */}
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
      </article>
    </main>
  );
}
