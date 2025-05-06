"use client";
import React, { useEffect, useState } from "react";
import { getPromotions, createPromotion, updatePromotion, Promotion } from "@/app/controllers/promotionController";
import { useAuth } from "@/app/context/AuthContext";
import PromotionModal from "./PromotionModal";

export default function AdminPromotions() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const { token } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPromotions(token);
      setPromotions(data);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch promotions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [token]);

  async function handleAddOrEdit(data: Partial<Promotion>) {
    if (!token) return;
    setModalLoading(true);
    setModalError(null);
    try {
      if (editPromotion) {
        await updatePromotion(editPromotion.id, data, token);
      } else {
        await createPromotion(data, token);
      }
      setModalOpen(false);
      setEditPromotion(null);
      await refresh();
    } catch (e: any) {
      setModalError(e?.message || "Failed to save promotion");
    } finally {
      setModalLoading(false);
    }
  }

  // Filter and paginate promotions
  const filteredPromotions = statusFilter === "all"
    ? promotions
    : promotions.filter(p => statusFilter === "active" ? p.is_active : !p.is_active);
  const totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE);
  const paginatedPromotions = filteredPromotions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Filter Controls at the top */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="promotion-status-filter" className="font-medium">Status:</label>
        <select
          id="promotion-status-filter"
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <h1 className="text-[#b49a4d] font-extrabold underline shadow-gold-sm hover:text-[#d4b572] transition">Promotions Management</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Available Promotions</span>
          <button
            className="px-4 py-2 rounded bg-[#d4b572] text-white"
            onClick={() => { setModalOpen(true); setEditPromotion(null); }}
          >
            Add Promotion
          </button>
        </div>
        {loading ? (
          <div className="text-gray-400">Loading promotions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredPromotions.length === 0 ? (
          <div className="text-gray-400">No promotions found.</div>
        ) : (
          <>
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-[#fffbe6]">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Promo Code</th>
                <th className="p-3 text-left">Discount Value</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPromotions.map((promo) => (
                <tr key={promo.id} className="border-b last:border-b-0">
                  <td className="p-3 font-semibold">{promo.title}</td>
                  <td className="p-3">{promo.promo_code}</td>
                  <td className="p-3">{promo.discount_value !== undefined ? promo.discount_value : '-'}</td>
                  <td className="p-3">{promo.end_date}</td>
                  <td className="p-3">
                    {promo.is_active ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs">Inactive</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-xs mr-2"
                      onClick={() => { setEditPromotion(promo); setModalOpen(true); }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {filteredPromotions.length > PAGE_SIZE && (
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
          </>
        )}
        <PromotionModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditPromotion(null); setModalError(null); }}
          onSubmit={handleAddOrEdit}
          loading={modalLoading}
          error={modalError}
          initial={editPromotion || undefined}
        />
      </div>
    </div>
  );
}

