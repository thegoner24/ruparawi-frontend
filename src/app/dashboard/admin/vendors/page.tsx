"use client";
import React, { useEffect, useState } from "react";
import { getVendors, reviewVendorApplication, Vendor } from "@/app/controllers/vendorController";
import { useAuth } from "@/app/context/AuthContext";
import VendorReviewModal from "./VendorReviewModal";

export default function AdminVendors() {
  const [filter, setFilter] = useState<string>("all");
  const { token } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const filteredVendors = filter === "all" ? vendors : vendors.filter(v => v.status === filter);
  const totalPages = Math.ceil(filteredVendors.length / PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Vendor | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getVendors(token);
      setVendors(data);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [token]);

  async function handleReviewSubmit(review: { status: string; note?: string }) {
    if (!token || !reviewTarget) return;
    setReviewLoading(true);
    setReviewError(null);
    try {
      await reviewVendorApplication(reviewTarget.user_id, review, token);
      setReviewTarget(null);
      await refresh();
    } catch (e: any) {
      setReviewError(e?.message || "Failed to review vendor application");
    } finally {
      setReviewLoading(false);
    }
  }

  return (
    <div>
      {/* Filter Controls at the top */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="vendor-filter" className="font-medium">Filter:</label>
        <select
          id="vendor-filter"
          className="border rounded px-2 py-1"
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <h1 className="text-[#b49a4d] font-extrabold underline shadow-gold-sm hover:text-[#d4b572] transition">Vendors Management</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <div className="text-gray-400">Loading vendors...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : vendors.length === 0 ? (
          <div className="text-gray-400">No vendors found.</div>
        ) : (
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-[#fffbe6]">
                <th className="p-3 text-left text-[#d4b572]">Name</th>
                <th className="p-3 text-left text-[#d4b572]">Email</th>
                <th className="p-3 text-left text-[#d4b572]">Status</th>
                <th className="p-3 text-left text-[#d4b572]">Applied At</th>
                <th className="p-3 text-left text-[#d4b572]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((vendor) => (
                    <tr key={vendor.user_id + '-' + vendor.status} className="border-b last:border-b-0">
                  <td className="p-3 font-semibold">{vendor.business_name}</td>
                  <td className="p-3">{vendor.business_email}</td>
                  <td className="p-3">
                    <span className={
                      vendor.status === "approved"
                        ? "px-2 py-1 rounded bg-[#fff7e0] text-[#d4b572] text-xs"
                        : vendor.status === "pending"
                        ? "px-2 py-1 rounded bg-[#fff7e0] text-[#d4b572] text-xs"
                        : "px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs"
                    }>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">{vendor.created_at ? new Date(vendor.created_at).toLocaleString() : '-'}</td>
                  <td className="p-3 flex gap-2">
                    {vendor.status === "pending" && (
                      <button className="px-3 py-1 rounded border-[#f5e6b2] hover:bg-[#fff7e0] text-[#d4b572] text-sm" onClick={() => setReviewTarget(vendor)}>
                        Review Application
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {filteredVendors.length > PAGE_SIZE && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="mx-2">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
        {reviewTarget && (
          <VendorReviewModal
            vendor={reviewTarget}
            loading={reviewLoading}
            error={reviewError}
            onClose={() => setReviewTarget(null)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </div>
    </div>
  );
}
