"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
import type { Article } from "./api";

interface ArticleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (article: Partial<Article>) => void;
  loading?: boolean;
  error?: string | null;
  initial?: Partial<Article>;
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  // Accepts .jpg, .jpeg, .png, .gif, .webp (case-insensitive)
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

export default function ArticleModal({ open, onClose, onSubmit, loading, error, initial }: ArticleModalProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [image, setImage] = useState<string>(initial?.image_url || "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setImage(initial?.image_url || "");
  }, [initial, open]);



  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, content, image_url: image });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
        <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-pink-600 transition-colors" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-2xl font-extrabold mb-6 text-pink-700 flex items-center gap-2">
          {initial ? <span className="inline-block bg-pink-100 text-pink-700 rounded px-2 py-1 text-sm font-semibold">Edit</span> : <span className="inline-block bg-pink-100 text-pink-700 rounded px-2 py-1 text-sm font-semibold">Add</span>}
          Article
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              className="peer w-full border-2 border-pink-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition placeholder-transparent"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              id="article-title-input"
              placeholder="Article title"
            />
            <label htmlFor="article-title-input" className="absolute left-4 top-3 text-gray-400 transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-pink-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white px-1 pointer-events-none">
              Title<span className="text-pink-600">*</span>
            </label>
          </div>
          <div className="relative">
            <label className="block font-medium mb-1 mb-2">Content<span className="text-pink-600">*</span></label>
            <div className="rounded-lg border-2 border-pink-200 focus-within:border-pink-500 bg-white overflow-hidden">
              <MDEditor
                value={content}
                onChange={(v: string | undefined) => setContent(v || "")}
                height={200}
                preview="edit"
                textareaProps={{
                  placeholder: "Write your article content in markdown...",
                  required: true,
                  id: "article-content-input"
                }}
              />
            </div>
          </div>
          <div className="relative mt-2">
            <input
              type="url"
              id="article-image-url"
              className={`peer w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition placeholder-transparent ${image && isValidImageUrl(image) ? 'border-pink-500' : 'border-pink-200'} ${image && !isValidImageUrl(image) ? 'border-red-400' : ''}`}
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              autoComplete="off"
              spellCheck={false}
              inputMode="url"
            />
            <label htmlFor="article-image-url" className="absolute left-4 top-3 text-gray-400 transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-pink-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white px-1 pointer-events-none">
              Image URL
            </label>
            {image && (
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-pink-600 text-lg focus:outline-none"
                aria-label="Clear image URL"
                tabIndex={0}
                onClick={() => setImage("")}
              >
                &times;
              </button>
            )}
            {image && isValidImageUrl(image) && (
              <div className="mt-3 flex flex-col items-start">
                <span className="text-xs text-gray-400 mb-1">Image Preview:</span>
                <img src={image} alt="Preview" className="rounded-lg border border-gray-200 max-h-40 shadow" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
            {image && !isValidImageUrl(image) && (
              <div className="text-xs text-red-500 mt-2">Invalid image URL. Please enter a direct link to a .jpg, .jpeg, .png, .gif, or .webp image.</div>
            )}
          </div>


          {error && <div className="text-red-500 text-sm font-semibold border border-red-200 bg-red-50 rounded p-2">{error}</div>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 font-bold shadow-md transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Saving...</span>
              ) : (initial ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
