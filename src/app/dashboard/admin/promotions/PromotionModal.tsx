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

import { FaPercent, FaCalendarAlt, FaBarcode, FaBoxOpen, FaImage, FaInfoCircle, FaTags } from "react-icons/fa";
import { getCategories, Category } from "@/app/controllers/categoryController";
import { useAuth } from "@/app/context/AuthContext";

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
  const { token } = useAuth();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<number[]>(initial?.category_ids || []);

  React.useEffect(() => {
    async function fetchCategories() {
      if (!token) return;
      try {
        const cats = await getCategories(token);
        setCategories(cats);
      } catch (err) {
        setCategories([]);
      }
    }
    fetchCategories();
  }, [token]);

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
    setSelectedCategoryIds(initial?.category_ids || []);
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
      product_ids: ids,
      category_ids: selectedCategoryIds
    });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-100 via-white to-yellow-200 animate-fade-in flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl p-0 relative flex flex-col animate-slide-up overflow-auto border-4 border-yellow-200">
        <button className="absolute top-4 right-6 text-gray-400 hover:text-yellow-500 text-4xl z-10 transition-all duration-150" onClick={onClose} aria-label="Close">&times;</button>
        <div className="w-full px-8 py-10 flex-1 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="rounded-full bg-yellow-100 p-4 shadow-gold-sm">
              <FaPercent className="text-4xl text-yellow-500" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-yellow-700">{initial ? "Edit" : "Add"} Promotion</h2>
              <div className="text-lg text-yellow-600 font-medium mt-1">Create a new promotion to boost your sales!</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-10 flex-1 flex flex-col">
            {/* SECTION: Promotion Details */}
            <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1 text-yellow-900">Title <span className="text-yellow-700">*</span></label>
                <input className="w-full border-2 border-yellow-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-yellow-400" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Summer Sale" />
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

            {/* Category Dropdown */}
            <div className="mb-6">
              <label className="block font-semibold mb-1 flex items-center gap-1 text-yellow-800"><FaTags style={{ color: '#FFD700' }} /> Category <span className="text-yellow-700">*</span></label>
              <div className="relative">
                <select
                  className="w-full border-2 border-yellow-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition text-gray-900 bg-white placeholder-gray-400 shadow-sm hover:border-yellow-400 cursor-pointer"
                  value={selectedCategoryIds[0] ? String(selectedCategoryIds[0]) : ''}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setSelectedCategoryIds(val ? [val] : []);
                  }}
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <FaTags className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none" />
              </div>
              <div className="text-xs text-yellow-700 mt-1">Choose the main category for this promotion.</div>
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
