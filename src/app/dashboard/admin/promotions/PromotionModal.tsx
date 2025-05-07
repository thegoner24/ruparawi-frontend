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

import { FaPercent, FaCalendarAlt, FaBarcode, FaBoxOpen, FaImage, FaInfoCircle } from "react-icons/fa";

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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 animate-fade-in flex items-stretch justify-stretch">
      <div className="bg-white w-full h-full max-h-screen rounded-none shadow-2xl p-0 relative flex flex-col animate-slide-up overflow-auto">
        <button className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-3xl z-10" onClick={onClose} aria-label="Close">&times;</button>
        <div className="w-full max-w-4xl mx-auto p-8 flex-1 flex flex-col">
          <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-yellow-700 mt-4">
            <FaPercent className="inline-block" style={{ color: '#FFD700' }} />
            {initial ? "Edit" : "Add"} Promotion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col">

            {/* Required Fields Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-yellow-50 rounded-xl p-7 mb-4 border border-yellow-200">
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">Title <span className="text-yellow-700">*</span></label>
                <input className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Summer Sale" />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaBarcode className="" style={{ color: '#FFD700' }} /> Promo Code <span className="text-yellow-700">*</span></label>
                <input className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={promoCode} onChange={e => setPromoCode(e.target.value)} required placeholder="e.g. SUMMER20" />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaPercent className="" style={{ color: '#FFD700' }} /> Discount Value <span className="text-yellow-700">*</span>
                  <span title="Amount or percentage off" className="ml-1 text-gray-400 cursor-pointer"><FaInfoCircle /></span>
                </label>
                <input type="number" className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} min={0} required placeholder="e.g. 20" />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaBoxOpen className="" style={{ color: '#FFD700' }} /> Promotion Type <span className="text-yellow-700">*</span>
                  <span title="e.g. percentage_discount, fixed_amount" className="ml-1 text-gray-400 cursor-pointer"><FaInfoCircle /></span>
                </label>
                <input className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={promotionType} onChange={e => setPromotionType(e.target.value)} required placeholder="e.g. percentage_discount" />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaCalendarAlt className="" style={{ color: '#FFD700' }} /> Start Date <span className="text-yellow-700">*</span></label>
                <input type="date" className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaCalendarAlt className="" style={{ color: '#FFD700' }} /> End Date <span className="text-yellow-700">*</span></label>
                <input type="date" className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaBoxOpen className="" style={{ color: '#FFD700' }} /> Product IDs (comma separated) <span className="text-yellow-700">*</span></label>
                <input className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition text-gray-900 bg-white placeholder-gray-400" value={productIds} onChange={e => setProductIds(e.target.value)} required placeholder="e.g. 1,2,3" />
                <div className="text-xs text-gray-600 mt-1">Enter product IDs separated by commas. Example: <span className="font-mono">1,2,3</span></div>
              </div>
            </div>

            {/* Optional Fields Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 flex items-center gap-1">Description</label>
                <textarea className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 transition text-gray-900 bg-white placeholder-gray-400" value={description} onChange={e => setDescription(e.target.value)} placeholder="Promotion details (optional)" />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1"><FaImage className="" style={{ color: '#FFD700' }} /> Image URL</label>
                <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 transition text-gray-900 bg-white placeholder-gray-400" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                {imageUrl && imageUrl.startsWith('http') && (
                  <img src={imageUrl} alt="Promotion" className="mt-2 rounded shadow max-h-24 mx-auto" style={{objectFit:'contain'}} />
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">Max Discount
                  <span title="Maximum discount amount for this promo" className="ml-1 text-gray-400 cursor-pointer"><FaInfoCircle /></span>
                </label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 transition text-gray-900 bg-white placeholder-gray-400" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} min={0} placeholder="e.g. 100000" />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">Usage Limit
                  <span title="How many times this promo can be used in total" className="ml-1 text-gray-400 cursor-pointer"><FaInfoCircle /></span>
                </label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 transition text-gray-900 bg-white placeholder-gray-400" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} min={0} placeholder="e.g. 10" />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <div className="flex justify-end gap-2 mt-7">
              <button type="button" className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition" onClick={onClose}>Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-200 transition font-semibold" disabled={loading}>{loading ? "Saving..." : (initial ? "Update" : "Create")}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
