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
  // --- Comments State ---
  type Comment = { name: string; content: string; date: string };
  const [mockComments, setMockComments] = useState<Comment[]>([
    { name: "Alice", content: "Great article!", date: "2025-05-01" },
    { name: "Bob", content: "Thanks for the info.", date: "2025-05-02" },
  ]);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
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
        {(article.image_url || article.image) && (
          <div className="mb-10">
            {article.image_url ? (
              <a href={article.image_url} target="_blank" rel="noopener noreferrer" className="block group">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover border border-pink-100 group-hover:shadow-lg transition"
                />
                <span className="flex items-center gap-1 text-xs text-pink-600 mt-1 group-hover:underline">
                  View original image
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 015.656 5.656M15 7h6m0 0v6m0-6L10 21" /></svg>
                </span>
              </a>
            ) : (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto object-cover border border-pink-100"
              />
            )}
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

      {/* Comments Section */}
      <section className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Comments <span className="text-base text-gray-400">({mockComments.length})</span></h2>
        <form
          className="mb-8 flex flex-col gap-3 bg-pink-50 rounded-lg p-4"
          onSubmit={e => {
            e.preventDefault();
            if (!commentName.trim() || !commentContent.trim()) return;
            setMockComments([
              { name: commentName, content: commentContent, date: new Date().toISOString() },
              ...mockComments,
            ]);
            setCommentName("");
            setCommentContent("");
          }}
        >
          <div className="flex gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Your name"
              value={commentName}
              onChange={e => setCommentName(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
            >Add Comment</button>
          </div>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[60px]"
            placeholder="Write your comment..."
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            required
          />
        </form>
        <div className="flex flex-col gap-6">
          {mockComments.length === 0 ? (
            <div className="text-gray-400">No comments yet. Be the first to comment!</div>
          ) : (
            mockComments.map((c: Comment, i: number) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-pink-700">{c.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.date)}</span>
                </div>
                <div className="text-gray-800 whitespace-pre-line">{c.content}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
