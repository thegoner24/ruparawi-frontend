"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchArticleById, fetchArticles } from "../api";
import type { Article } from "../api";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarArticles, setSidebarArticles] = useState<Article[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticleById(Number(id));
        if (!data.article) throw new Error("Article not found");
        setArticle(data.article);
      } catch (err: any) {
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadSidebar() {
      setSidebarLoading(true);
      try {
        const data = await fetchArticles();
        let list: Article[] = [];
        if (Array.isArray(data.articles)) list = data.articles;
        else if (Array.isArray(data.article)) list = data.article;
        else if (data.article) list = [data.article];
        setSidebarArticles(list.filter(a => a.id !== Number(id)));
      } catch {
        setSidebarArticles([]);
      } finally {
        setSidebarLoading(false);
      }
    }
    loadSidebar();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Article */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <Link href="/articles" className="text-yellow-600 underline mb-6 inline-block font-semibold">&larr; Back to Articles</Link>
          {loading ? (
            <div className="text-gray-400">Loading article...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : article ? (
            <>
              {article.image_url && (
                <img src={article.image_url} alt="Article" className="mb-8 rounded-2xl border border-yellow-100 w-full h-auto shadow" />
              )}
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold tracking-wider border border-yellow-200">Featured Article</div>
              <h1 className="text-4xl font-extrabold mb-3 leading-tight text-yellow-700">{article.title}</h1>
              <div className="flex items-center gap-3 text-sm text-yellow-700 mb-8 font-medium">
                <span>Published: {new Date(article.created_at).toLocaleString()}</span>
                {/* <span>&bull;</span>
                <span>5 min read</span> */}
              </div>
              <div className="prose prose-yellow max-w-none text-lg mt-6" dangerouslySetInnerHTML={{ __html: article.content }} />
            </>
          ) : null}
        </div>
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100">
            <h2 className="text-lg font-bold mb-6 text-yellow-700 flex items-center gap-2"><span className='inline-block w-2 h-2 bg-yellow-400 rounded-full'></span>Top Stories</h2>
            {sidebarLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : sidebarArticles.length === 0 ? (
              <div className="text-gray-400">No other articles.</div>
            ) : (
              <ul className="space-y-4">
                {sidebarArticles.slice(0, 5).map(a => (
                  <li key={a.id} className="flex gap-3 items-center">
                    {a.image_url && (
                      <img src={a.image_url} alt={a.title} className="w-16 h-16 object-cover rounded-md border bg-gray-50" />
                    )}
                    <div>
                      <Link href={`/articles/${a.id}`} className="font-semibold text-yellow-700 hover:text-yellow-900 line-clamp-2">
                        {a.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
