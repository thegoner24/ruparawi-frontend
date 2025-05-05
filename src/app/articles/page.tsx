"use client";
import React, { useEffect, useState } from "react";
import { fetchArticles } from "../dashboard/admin/articles/api";
import type { Article } from "../dashboard/admin/articles/api";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticles();
        setArticles(Array.isArray(data.articles) ? data.articles : []);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const trending = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <header className="pt-10 pb-16 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold tracking-wider border border-yellow-200">Blog</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Insights for Building a<br />Sustainable Future</h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-6">Explore the latest articles, news, and insights to help your business achieve sustainability and compliance.</p>
        </div>
      </header>

      {/* TRENDING ARTICLE */}
      <main className="max-w-3xl mx-auto px-4">
        <section className="mt-12 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15" stroke="#fbbf24" strokeWidth="2" /></svg>Blog</span>
            <span className="ml-2 text-xl font-semibold">Our Trending Article <span className="text-gray-300 font-light">[{articles.length}]</span></span>
          </div>
          <hr className="mb-6" />
          {loading ? (
            <div className="text-gray-400 py-10">Loading articles...</div>
          ) : error ? (
            <div className="text-red-500 py-10">{error}</div>
          ) : !trending ? (
            <div className="text-gray-400 py-10">No articles found.</div>
          ) : (
            <Link href={`/articles/${trending.id}`} className="block group rounded-2xl border border-gray-100 bg-white shadow hover:shadow-lg transition overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {trending.image_url && (
                  <div className="md:w-64 w-full h-48 md:h-auto overflow-hidden flex-shrink-0">
                    <img src={trending.image_url} alt={trending.title} className="object-cover w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-t-none transition group-hover:scale-105 duration-300" />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="text-xs text-yellow-700 font-semibold mb-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15" stroke="#fbbf24" strokeWidth="2" /></svg>Blog</div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-700 transition-colors">{trending.title}</h2>
                  <div className="text-gray-500 mb-3 line-clamp-2">{trending.content?.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>By {trending.author_name || 'Unknown'}</span>
                    <span>&middot;</span>
                    <span>{new Date(trending.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </section>

        {/* REST OF ARTICLES */}
        {rest.length > 0 && (
  <section className="w-full mb-20">
    <div className="max-w-7xl mx-auto px-4">
      <h3 className="text-lg font-bold mb-8 text-gray-700">More Articles</h3>
      <div className="flex flex-col gap-12">
        {rest.map(article => (
          <Link key={article.id} href={`/articles/${article.id}`} className="block">
            <div className="flex flex-col md:flex-row items-center md:items-stretch bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
              <div className="flex-1 flex flex-col justify-center p-8 md:pr-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15" stroke="#fbbf24" strokeWidth="2" /></svg>
                    Blog
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-3 text-black leading-snug">{article.title}</h4>
                <div className="text-base text-gray-600 mb-2 line-clamp-3">{article.content?.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
              </div>
              {article.image_url && (
                <div className="md:w-[340px] w-full h-56 md:h-auto flex-shrink-0 overflow-hidden flex items-center justify-center bg-gray-50">
                  <img src={article.image_url} alt={article.title} className="object-cover w-full h-full rounded-none md:rounded-l-none md:rounded-r-2xl" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
      </main>
    </div>
  );
}
