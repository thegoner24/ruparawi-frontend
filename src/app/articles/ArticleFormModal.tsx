"use client";
import React, { useState, useEffect } from "react";

interface ArticleFormModalProps {
  open: boolean;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
  mode: "add" | "edit";
}

export default function ArticleFormModal({ open, initialData, onSubmit, onCancel, loading, mode }: ArticleFormModalProps) {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    author: "",
    tags: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        image_url: initialData.image_url || initialData.image || "",
        author: initialData.author || "",
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : (initialData.tags || ""),
      });
    } else {
      setForm({
        title: "",
        excerpt: "",
        content: "",
        image_url: "",
        author: "",
        tags: "",
      });
    }
  }, [initialData, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative animate-fade-in">
        <h3 className="text-lg font-bold mb-4 text-pink-700">{mode === "add" ? "Add Article" : "Edit Article"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Excerpt</label>
            <input
              name="excerpt"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.excerpt}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea
              name="content"
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Image URL</label>
            <input
              name="image_url"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.image_url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Author</label>
            <input
              name="author"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.author}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tags (comma separated)</label>
            <input
              name="tags"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.tags}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (mode === "add" ? "Adding..." : "Saving...") : (mode === "add" ? "Add" : "Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
