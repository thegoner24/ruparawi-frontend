"use client";
import React, { useState } from "react";
import { Promotion } from "@/app/controllers/promotionController";

interface PromotionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Promotion>) => void;
  loading?: boolean;
  error?: string | null;
  initial?: Partial<Promotion>;
}

export default function PromotionModal({ open, onClose, onSubmit, loading, error, initial }: PromotionModalProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [promoCode, setPromoCode] = useState(initial?.promo_code || "");
  const [discountValue, setDiscountValue] = useState(initial?.discount_value || 0);
  const [promotionType, setPromotionType] = useState(initial?.promotion_type || "");
  const [startDate, setStartDate] = useState(initial?.start_date || "");
  const [endDate, setEndDate] = useState(initial?.end_date || "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");
  const [maxDiscount, setMaxDiscount] = useState(initial?.max_discount || "");
  const [usageLimit, setUsageLimit] = useState(initial?.usage_limit || "");
  const [productIds, setProductIds] = useState(initial?.product_ids ? initial.product_ids.join(",") : "");

  React.useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setPromoCode(initial?.promo_code || "");
    setDiscountValue(initial?.discount_value || 0);
    setPromotionType(initial?.promotion_type || "");
    setStartDate(initial?.start_date || "");
    setEndDate(initial?.end_date || "");
    setImageUrl(initial?.image_url || "");
    setMaxDiscount(initial?.max_discount || "");
    setUsageLimit(initial?.usage_limit || "");
    setProductIds(initial?.product_ids ? initial.product_ids.join(",") : "");
  }, [initial, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ids = productIds.split(",").map((s: string) => parseInt(s.trim(), 10)).filter(Boolean);
    onSubmit({
      title,
      description,
      promo_code: promoCode,
      discount_value: Number(discountValue),
      promotion_type: promotionType,
      start_date: startDate,
      end_date: endDate,
      image_url: imageUrl || undefined,
      max_discount: maxDiscount ? Number(maxDiscount) : undefined,
      usage_limit: usageLimit ? Number(usageLimit) : undefined,
      product_ids: ids
    });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">{initial ? "Edit" : "Add"} Promotion</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50 rounded-lg p-4 mb-2">
            <div>
              <label className="block font-semibold mb-1">Title <span className="text-pink-600">*</span></label>
              <input className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Summer Sale" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Promo Code <span className="text-pink-600">*</span></label>
              <input className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={promoCode} onChange={e => setPromoCode(e.target.value)} required placeholder="e.g. SUMMER20" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Discount Value <span className="text-pink-600">*</span></label>
              <input type="number" className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} min={0} required placeholder="e.g. 20" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Promotion Type <span className="text-pink-600">*</span></label>
              <input className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={promotionType} onChange={e => setPromotionType(e.target.value)} required placeholder="e.g. percentage_discount" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Start Date <span className="text-pink-600">*</span></label>
              <input type="date" className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date <span className="text-pink-600">*</span></label>
              <input type="date" className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Product IDs (comma separated) <span className="text-pink-600">*</span></label>
              <input className="w-full border border-pink-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-400" value={productIds} onChange={e => setProductIds(e.target.value)} required placeholder="e.g. 1,2,3" />
              <div className="text-xs text-gray-500 mt-1">Enter product IDs separated by commas. Example: <span className="font-mono">1,2,3</span></div>
            </div>
          </div>

          {/* Optional Fields Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Description</label>
              <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-pink-200" value={description} onChange={e => setDescription(e.target.value)} placeholder="Promotion details (optional)" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-pink-200" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="block font-semibold mb-1">Max Discount</label>
              <input type="number" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-pink-200" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} min={0} placeholder="e.g. 100000" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Usage Limit</label>
              <input type="number" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-pink-200" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} min={0} placeholder="e.g. 10" />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700" disabled={loading}>{loading ? "Saving..." : (initial ? "Update" : "Create")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
