"use client";
import React, { useEffect, useState } from "react";
import { fetchArticles } from "../dashboard/admin/articles/api";
import type { Article } from "../dashboard/admin/articles/api";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  // Filter articles by search
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content?.toLowerCase().includes(search.toLowerCase())
  );

  const trending = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="w-full px-8 flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="inline-block mb-2 px-4 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold tracking-wider border border-yellow-200">Blog</div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Insights for Building a <span className="text-yellow-600">Sustainable Future</span></h1>
          </div>
          <a href="#articles" className="inline-block px-6 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition">Read Articles</a>
        </div>
      </header>

      {/* Search Bar */}
      <div className="w-full px-8 mt-10 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition bg-white text-lg outline-none"
        />
      </div>

      {/* Trending Article */}
      <main id="articles" className="w-full px-8">
        <section className="mt-10 mb-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15" stroke="#fbbf24" strokeWidth="2" /></svg>Blog</span>
            <span className="ml-2 text-xl font-semibold">Trending <span className="text-gray-300 font-light">[{filteredArticles.length}]</span></span>
          </div>
          <hr className="mb-6" />
          {loading ? (
            <div className="animate-pulse flex flex-col md:flex-row gap-4 bg-white rounded-2xl border border-gray-100 shadow p-6">
              <div className="bg-gray-200 h-48 w-full md:w-64 rounded-2xl" />
              <div className="flex-1 flex flex-col justify-center gap-3">
                <div className="bg-gray-200 h-6 w-32 rounded" />
                <div className="bg-gray-200 h-8 w-64 rounded" />
                <div className="bg-gray-200 h-4 w-40 rounded" />
                <div className="bg-gray-100 h-4 w-24 rounded" />
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-10">{error}</div>
          ) : !trending ? (
            <div className="text-gray-400 py-10">No articles found.</div>
          ) : (
            <Link href={`/articles/${trending.id}`} className="block group rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {trending.image_url && (
                  <div className="md:w-64 w-full h-48 md:h-auto overflow-hidden flex-shrink-0">
                    <img src={trending.image_url} alt={trending.title} className="object-cover w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-t-none transition group-hover:scale-105 duration-300" />
                  </div>
                )}
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15" stroke="#fbbf24" strokeWidth="2" /></svg>
                      Trending
                    </span>
                    {trending.author_avatar && (
                      <img src={trending.author_avatar} alt="avatar" className="w-7 h-7 rounded-full border border-yellow-200" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mb-2 group-hover:text-yellow-700 transition-colors">{trending.title}</h2>
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
            <h3 className="text-lg font-bold mb-8 text-gray-700">More Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {rest.map(article => (
                <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                  <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
                    {article.image_url && (
                      <div className="w-full h-48 overflow-hidden bg-gray-100">
                        <img src={article.image_url} alt={article.title} className="object-cover w-full h-full transition group-hover:scale-105 duration-300" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15" stroke="#fbbf24" strokeWidth="2" /></svg>
                          Blog
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-black leading-snug group-hover:text-yellow-700 transition-colors">{article.title}</h4>
                      <div className="text-base text-gray-600 mb-2 line-clamp-3">{article.content?.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                        <span>By {article.author_name || 'Unknown'}</span>
                        <span>&middot;</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
