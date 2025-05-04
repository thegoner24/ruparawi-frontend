"use client";
import React, { useState } from "react";
import ArticleModal, { Article } from "./ArticleModal";
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
      setArticles(Array.isArray(data.articles) ? data.articles : data);
    } catch (err: any) {
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
      if (editArticle) {
        await updateArticle(editArticle.id, data);
      } else {
        await createArticle(data);
      }
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
      await deleteArticle(deleteTarget.id);
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
      <h1 className="text-2xl font-bold mb-4 text-pink-700">Articles Management</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Articles</span>
          <button
            className="px-4 py-2 rounded bg-pink-600 text-white"
            onClick={() => { setModalOpen(true); setEditArticle(null); }}
          >
            Add Article
          </button>
        </div>
        {loading ? (
          <div className="text-gray-400">Loading articles...</div>
        ) : error ? (
          <div className="text-red-500">{error} <button className="ml-2 underline" onClick={loadArticles}>Retry</button></div>
        ) : articles.length === 0 ? (
          <div className="text-gray-400">No articles found.</div>
        ) : (
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-pink-50">
                <th className="p-3 text-left">Title</th>

                <th className="p-3 text-left">Published At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b hover:bg-pink-50 transition">
                  <td className="p-3 font-semibold text-pink-700">{article.title}</td>

                  <td className="p-3">{article.published_at}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded"
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
        )}
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
        articleTitle={deleteTarget?.title}
        error={deleteError}
      />
    </div>
  );
}
