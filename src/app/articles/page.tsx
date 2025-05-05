"use client";
import React, { useState } from "react";
import { fetchArticles, createArticle, updateArticle, deleteArticle } from "./api";
import ArticleFormModal from "./ArticleFormModal";
import DeleteArticleModal from "./DeleteArticleModal";
import Link from "next/link";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string|null>(null);
  const [sort, setSort] = useState<"newest"|"oldest">("newest");

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  // Admin panel state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add"|"edit">("add");
  const [selectedArticle, setSelectedArticle] = useState<any|null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number|string|null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string|null>(null);

  async function loadArticles() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticles();
      setArticles(Array.isArray(data.articles) ? data.articles : data);
    } catch (err: any) {
      setError(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setModalMode("add");
    setSelectedArticle(null);
    setModalOpen(true);
    setSuccess(null);
    setError(null);
  }
  function openEditModal(article: any) {
    setModalMode("edit");
    setSelectedArticle(article);
    setModalOpen(true);
    setSuccess(null);
    setError(null);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedArticle(null);
  }
  function openDeleteModal(article: any) {
    setDeleteId(article.id);
    setDeleteModalOpen(true);
    setSuccess(null);
    setError(null);
  }
  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeleteId(null);
  }

  async function handleSubmitArticle(data: any) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (modalMode === "add") {
        await createArticle(data);
        setSuccess("Article created successfully!");
      } else if (modalMode === "edit" && selectedArticle) {
        await updateArticle(selectedArticle.id, data);
        setSuccess("Article updated successfully!");
      }
      closeModal();
      loadArticles();
    } catch (err: any) {
      setError(err.message || "Failed to save article");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteArticle(delId?: number) {
    const idToDelete = typeof delId === "number" ? delId : (typeof deleteId === "string" ? Number(deleteId) : deleteId);
    if (!idToDelete) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteArticle(idToDelete);
      setSuccess("Article deleted successfully!");
      closeDeleteModal();
      loadArticles();
    } catch (err: any) {
      setError(err.message || "Failed to delete article");
    } finally {
      setSubmitting(false);
    }
  }

  React.useEffect(() => {
    loadArticles();
  }, []);

  // Filter, search, sort
  let filtered = articles.filter(a =>
    (!search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())) &&
    (!tag || a.tags.includes(tag))
  );
  filtered = filtered.sort((a, b) => sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-pink-700">Articles</h1>
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2 rounded-lg shadow"
          onClick={openAddModal}
        >
          + Add Article
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-2 py-2 rounded"
          value={tag || ""}
          onChange={e => setTag(e.target.value || null)}
        >
          <option value="">All Tags</option>
          {allTags.map((t, idx) => (
            <option key={t || idx} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="border px-2 py-2 rounded"
          value={sort}
          onChange={e => setSort(e.target.value as "newest"|"oldest")}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading articles...</div>
      ) : error ? (
        <div className="text-red-500">{error} <button className="ml-2 underline" onClick={loadArticles}>Retry</button></div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No articles found.</div>
      ) : (
        <div className="grid gap-6">
          {filtered.map(article => (
            <div key={article.id} className="block group rounded-xl shadow bg-white hover:shadow-lg transition overflow-hidden border border-pink-100">
              <div className="flex flex-col md:flex-row">
                <img src={article.image || article.image_url} alt={article.title} className="w-full md:w-48 h-40 object-cover bg-gray-100" />
                <div className="flex-1 p-4">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {article.tags?.map((t: string, idx: number) => (
                      <span key={t + idx} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded font-semibold">{t}</span>
                    ))}
                  </div>
                  <div className="font-bold text-lg mb-1 group-hover:text-pink-700 transition-colors">{article.title}</div>
                  <div className="text-gray-600 mb-2 line-clamp-2">{article.excerpt}</div>
                  <div className="text-xs text-gray-400">By {article.author} &middot; {article.date}</div>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/articles/${article.id}`} className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold px-3 py-1 rounded text-xs">View</Link>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded text-xs" onClick={() => openEditModal(article)} disabled={submitting}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded text-xs" onClick={() => openDeleteModal(article)} disabled={submitting}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ArticleFormModal
        open={modalOpen}
        initialData={selectedArticle}
        onSubmit={handleSubmitArticle}
        onCancel={closeModal}
        loading={submitting}
        mode={modalMode}
      />
      <DeleteArticleModal
        open={deleteModalOpen}
        articleTitle={articles.find(a => a.id === deleteId)?.title}
        onConfirm={() => deleteId && handleDeleteArticle(Number(deleteId))}
        onCancel={closeDeleteModal}
        loading={submitting}
      />
    </div>
    </>
  );
}
