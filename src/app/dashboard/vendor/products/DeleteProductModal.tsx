"use client";
import React from "react";

interface DeleteProductModalProps {
  open: boolean;
  productName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteProductModal({ open, productName, onConfirm, onCancel, loading }: DeleteProductModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm relative animate-fade-in">
        <h3 className="text-lg font-bold mb-4 text-red-700">Delete Product</h3>
        <p className="mb-6 text-gray-700">Are you sure you want to delete <span className="font-semibold text-black">{productName}</span>? This action cannot be undone.</p>
        <div className="flex gap-4 justify-end">
          <button
            className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded disabled:opacity-60"
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
