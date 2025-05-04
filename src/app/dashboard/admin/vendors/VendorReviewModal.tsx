"use client";
import React, { useState } from "react";

export default function VendorReviewModal({
  vendor,
  onSubmit,
  onClose,
  loading,
  error
}: {
  vendor: any,
  onSubmit: (review: { status: string; note?: string }) => void,
  onClose: () => void,
  loading: boolean,
  error: string | null
}) {
  const [status, setStatus] = useState("approved");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ status, note });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
        <h3 className="text-xl font-bold mb-2 text-pink-600">Review Vendor Application</h3>
        <div className="text-gray-700 font-semibold">{vendor.name} ({vendor.email})</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              className="w-full border rounded p-2"
              value={status}
              onChange={e => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Note (optional)</label>
            <textarea
              className="w-full border rounded p-2"
              value={note}
              onChange={e => setNote(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white font-semibold disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
