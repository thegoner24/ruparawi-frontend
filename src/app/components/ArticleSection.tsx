"use client";
import React from "react";
import Link from "next/link";

import { useEffect, useState } from "react";
import { fetchArticles, Article } from "../articles/api";



export default function ArticleSection() {
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

  return (
    <section className="w-full bg-white mt-16">
      <div className="w-full">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-lg">Loading articles...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500 text-lg">{error}</div>
        ) : articles.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-lg">No articles found.</div>
        ) : (
          <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-0">
            {/* Left: Title and button */}
            <div className="flex flex-col justify-center items-start px-6 py-12 md:px-16 lg:px-24 md:py-8 md:h-screen md:sticky md:top-0 bg-white z-10">
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-black">Latest Articles</h2>
              <p className="text-gray-700 mb-8 max-w-md">
                Discover the stories behind our community of artisans and the sustainable practices that make Rupa Rawi special. Scroll to explore our featured articles.
              </p>
              <a
                href="/articles"
                className="inline-flex bg-black text-white rounded-full px-6 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition"
              >
                VISIT THE ARTICLES
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:border-l md:border-gray-200">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group overflow-hidden border-b border-gray-200 relative h-[400px] md:h-[450px] flex flex-col"
                >
                  <div className="w-full h-[250px] md:h-[300px] overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center px-6 py-6 bg-white flex-grow">
                    <h3 className="text-lg font-semibold text-black mb-2 leading-snug group-hover:text-[#7C6A0A] transition-colors">
                      {article.title}
                    </h3>
                    <div className="text-sm text-gray-600">Read Article →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
