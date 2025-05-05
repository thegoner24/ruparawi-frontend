"use client";
import React from "react";
import type { Article } from "./api";

interface DeleteArticleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  article: Article;
  articleTitle?: string;
  error?: string | null;
}

export default function DeleteArticleModal({ open, onClose, onConfirm, loading, articleTitle, error }: DeleteArticleModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-fade-in">
        <h2 className="text-xl font-bold mb-2 text-red-600">Delete Article</h2>
        <p className="mb-4 text-gray-700">Are you sure you want to delete <span className="font-semibold text-pink-700">{articleTitle || "this article"}</span>? This action cannot be undone.</p>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
