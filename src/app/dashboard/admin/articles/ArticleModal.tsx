"use client";
import React, { useState, useEffect } from "react";

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  image_url?: string;
  published_at?: string;
}

interface ArticleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (article: Partial<Article>) => void;
  loading?: boolean;
  error?: string | null;
  initial?: Partial<Article>;
}

export default function ArticleModal({ open, onClose, onSubmit, loading, error, initial }: ArticleModalProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
  }, [initial, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, content });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">{initial ? "Edit" : "Add"} Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title<span className="text-pink-600">*</span></label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Article title" />
          </div>
          <div>
            <label className="block font-medium mb-1">Content<span className="text-pink-600">*</span></label>
            <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" value={content} onChange={e => setContent(e.target.value)} required placeholder="Article content" />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700" disabled={loading}>{loading ? "Saving..." : (initial ? "Update" : "Create")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
