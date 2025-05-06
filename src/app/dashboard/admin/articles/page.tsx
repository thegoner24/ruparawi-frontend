"use client";
import React, { useState } from "react";
import Link from "next/link";
import ArticleModal from "./ArticleModal";
import type { Article } from "./api";
import DeleteArticleModal from "./DeleteArticleModal";
import { fetchArticles, createArticle, updateArticle, deleteArticle } from "./api";

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  async function loadArticles() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticles();
      // Support both array and single article response
      if (Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else if (Array.isArray(data.article)) {
        setArticles(data.article);
      } else if (data.article) {
        setArticles([data.article]);
      } else {
        setArticles([]);
      }
    } catch (err: any) {
      console.error('Fetch articles error:', err);
      setError(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadArticles();
  }, []);

  async function handleAddOrEdit(data: Partial<Article>) {
    setModalLoading(true);
    setModalError(null);
    try {
      let resp;
      if (editArticle) {
        resp = await updateArticle(editArticle.id, data);
      } else {
        resp = await createArticle(data);
      }
      if (!resp.success) throw new Error(resp.message || 'Operation failed');
      setModalOpen(false);
      setEditArticle(null);
      loadArticles();
    } catch (err: any) {
      setModalError(err.message || "Failed to save article");
    } finally {
      setModalLoading(false);
    }
  }

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openDeleteModal(article: Article) {
    setDeleteTarget(article);
    setDeleteModalOpen(true);
    setDeleteError(null);
  }
  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setDeleteError(null);
  }
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const resp = await deleteArticle(deleteTarget.id);
      if (!resp.success) throw new Error(resp.message || 'Delete failed');
      closeDeleteModal();
      loadArticles();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete article");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#d4b572]">Articles Management</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Articles</span>
          <button
            className="px-4 py-2 rounded bg-[#d4b572] text-white"
            onClick={() => { setModalOpen(true); setEditArticle(null); }}
          >
            Add Article
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-[#f5e6b2] text-red-700 rounded flex items-center gap-2">
            <span className="font-bold">Error:</span> {error} <button className="ml-2 underline text-red-700" onClick={loadArticles}>Retry</button>
          </div>
        )}
        {loading && !error ? (
          <div className="text-gray-400">Loading articles...</div>
        ) : !error && articles.length === 0 ? (
          <div className="text-gray-400">No articles found.</div>
        ) : !error && articles.length > 0 ? (
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-[#fffbe6]">
                <th className="py-2 px-4 text-left text-[#d4b572]">Title</th>
                <th className="py-2 px-4 text-left text-[#d4b572]">Created</th>
                <th className="py-2 px-4 text-left text-[#d4b572]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b">
                  <td className="py-2 px-4">
                    <Link href={`/articles/${article.id}`} className="text-[#b49a4d] font-extrabold underline shadow-gold-sm hover:text-[#d4b572] transition">
                      {article.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-500">{new Date(article.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="bg-[#d4b572] hover:bg-[#fff7e0] text-white font-bold px-3 py-1 rounded"
                      onClick={() => { setModalOpen(true); setEditArticle(article); }}
                      disabled={modalLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded"
                      onClick={() => openDeleteModal(article)}
                      disabled={modalLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <ArticleModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditArticle(null); setModalError(null); }}
          onSubmit={handleAddOrEdit}
          loading={modalLoading}
          error={modalError}
          initial={editArticle || undefined}
        />
      </div>
      <DeleteArticleModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        article={deleteTarget as any}
        articleTitle={deleteTarget?.title}
        error={deleteError}
      />
    </div>
  );
}
