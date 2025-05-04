"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DeleteProductModal from "./DeleteProductModal";

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_category_id?: number | null;
  subcategories?: Category[];
}

import { API_BASE_URL } from "@/app/controllers/authController";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number; // legacy, use stock_quantity in backend
  image_url: string;
  is_deleted?: boolean;
  // Extended fields for backend compatibility
  tags?: string[];
  sustainability_attributes?: string[];
  images?: string[] | string; // backend may send as stringified array
  min_order_quantity?: number;
  is_active?: boolean;
  category_id?: number;
  primary_image_url?: string;
  stock_quantity?: number;
}

type ProductFormState = {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  tags: string;
  sustainability_attributes: string;
  images: string;
  min_order_quantity: number;
  is_active: boolean;
  category_id: number;
  primary_image_url: string;
};

type ModalMode = "add" | "edit" | null;

function formatIDR(amount: string | number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(amount));
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<ProductFormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  // Pagination and filter
  const [pagination, setPagination] = useState({ current_page: 1, pages: 1, per_page: 10, total: 0 });
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(pagination.current_page);
    // eslint-disable-next-line
  }, [pagination.current_page]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  async function fetchCategories() {
    setCatLoading(true);
    setCatError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/products/category`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      // Flatten categories and subcategories into a single array
      let cats: Category[] = [];
      function flatten(catArr: Category[]) {
        for (const cat of catArr) {
          cats.push({ id: cat.id, name: cat.name });
          if (cat.subcategories && cat.subcategories.length > 0) flatten(cat.subcategories);
        }
      }
      flatten(data.data.categories || []);
      setCategories(cats);
    } catch (err: any) {
      setCatError(err.message || "Unknown error");
    } finally {
      setCatLoading(false);
    }
  }

  async function fetchProducts(page = 1) {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
      let url = `${API_BASE_URL}/vendor/products?page=${page}&per_page=10`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setPagination(data.pagination || { current_page: 1, pages: 1, per_page: 10, total: 0 });
      setProducts(Array.isArray(data.products)
        ? data.products
            .filter((p: any) => !p.is_deleted)
            .map((p: any): Product => {
              // Parse images string (if present)
              let image_url = "";
              if (p.images) {
                try {
                  // Replace single quotes with double quotes for valid JSON
                  const imagesArr = JSON.parse(p.images.replace(/'/g, '"'));
                  if (Array.isArray(imagesArr) && imagesArr.length > 0) {
                    const primary = imagesArr.find((img: any) => img.is_primary);
                    image_url = (primary && primary.image_url) || imagesArr[0].image_url;
                  }
                } catch (e) {
                  // fallback
                  image_url = p.image_url || p.product_image || p.image || "";
                }
              } else {
                image_url = p.image_url || p.product_image || p.image || "";
              }
              return {
                ...p,
                image_url,
                stock: p.stock_quantity ?? p.stock ?? p.product_stock ?? 0,
              };
            })
        : []
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function openModal(mode: ModalMode, product?: Product) {
    setModalMode(mode);
    setSelectedProduct(product || null);
    setForm(product ? {
      ...product,
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : (product.tags || ""),
      sustainability_attributes: Array.isArray(product.sustainability_attributes) ? product.sustainability_attributes.join(", ") : (product.sustainability_attributes || ""),
      images: Array.isArray(product.images) ? product.images.join(", ") : (typeof product.images === "string" ? product.images : ""),
      min_order_quantity: product.min_order_quantity ?? 1,
      is_active: product.is_active ?? true,
      category_id: product.category_id ?? 1,
      primary_image_url: product.primary_image_url || "",
      stock_quantity: product.stock_quantity ?? product.stock ?? 0,
    } : {
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      image_url: "",
      tags: "",
      sustainability_attributes: "",
      images: "",
      min_order_quantity: 1,
      is_active: true,
      category_id: 1,
      primary_image_url: "",
    });
    setModalOpen(true);
    setSuccess(null);
    setError(null);
  }
  function closeModal() {
    setModalOpen(false);
    setModalMode(null);
    setSelectedProduct(null);
    setForm({});
    setSuccess(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      };
      let url = `${API_BASE_URL}/products`;
      let method: "POST" | "PUT" = "POST";
      if (modalMode === "edit" && selectedProduct) {
        url = `${API_BASE_URL}/products/${selectedProduct.id}`;
        method = "PUT";
      }
      // Prepare payload according to backend requirements
      const payload: any = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock_quantity: typeof form.stock_quantity === 'number' ? form.stock_quantity : 0,
        category_id: typeof form.category_id === 'number' ? form.category_id : 1,
        min_order_quantity: typeof form.min_order_quantity === 'number' ? form.min_order_quantity : 1,
        tags: typeof form.tags === "string" ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : (Array.isArray(form.tags) ? form.tags : []),
        sustainability_attributes: typeof form.sustainability_attributes === "string" ? form.sustainability_attributes.split(",").map(s => s.trim()).filter(Boolean) : (Array.isArray(form.sustainability_attributes) ? form.sustainability_attributes : []),
        is_active: typeof form.is_active === 'boolean' ? form.is_active : true,
        primary_image_url: form.primary_image_url || "",
        images: typeof form.images === "string"
          ? (form.images.split(",").map((s: string) => s.trim()).filter((s: string) => s && /^https?:\/\//.test(s)) as string[])
          : (Array.isArray(form.images) ? (form.images as string[]).filter((s: string) => typeof s === 'string' && /^https?:\/\//.test(s)) : []),
      };
      // Ensure all required fields are present
      if (!payload.tags) payload.tags = [];
      if (!payload.sustainability_attributes) payload.sustainability_attributes = [];
      if (!payload.images) payload.images = [];
      if (typeof payload.price !== 'number') payload.price = 0;
      if (typeof payload.stock_quantity !== 'number') payload.stock_quantity = 0;
      if (typeof payload.category_id !== 'number') payload.category_id = 1;
      if (typeof payload.min_order_quantity !== 'number') payload.min_order_quantity = 1;
      if (typeof payload.is_active !== 'boolean') payload.is_active = true;
      if (!payload.primary_image_url) payload.primary_image_url = "";
      console.log("Submitting product payload:", payload);
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error("Failed to save product: " + errorText);
      }
      setSuccess("Product saved successfully!");
      closeModal();
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(productId: number) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }

  // Reactivate an inactive product
  async function handleReactivate(productId: number) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ is_active: true }),
      });
      if (!res.ok) throw new Error("Failed to reactivate product");
      setSuccess("Product reactivated successfully!");
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  function filteredProducts() {
    if (filterStatus === 'all') return products;
    if (filterStatus === 'active') return products.filter(p => p.is_active);
    return products.filter(p => !p.is_active);
  }

  return (
    <>
      <div className="mt-10 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 w-full gap-4">
          <div className="flex gap-2 items-center">
          <label htmlFor="statusFilter" className="font-medium text-gray-600">Filter:</label>
          <select
            id="statusFilter"
            className="border rounded px-2 py-1"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value as 'all' | 'active' | 'inactive'); }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded-lg shadow"
          onClick={() => openModal("add")}
        >
          + Add Product
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto w-full">
        {loading && <div className="text-gray-400 py-8 text-center">Loading products...</div>}
        {error && <div className="text-red-500 py-8 text-center">{error}</div>}
        {success && <div className="text-green-600 font-semibold mb-4">{success}</div>}
        {!loading && !error && (
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-yellow-50">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts().length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">No products found.</td>
                </tr>
              )}
              {filteredProducts().map((product, idx) => (
                <tr key={`${product.id}-${idx}`} className="border-b hover:bg-yellow-50 transition">
                  <td className="p-3">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded shadow border" />
                    ) : (
                      <span className="text-gray-300">No Image</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-yellow-700">
                    <Link
                      href={`/shop/${product.id}`}
                      className="text-yellow-700 underline hover:text-yellow-900 cursor-pointer transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-700 max-w-xs truncate">{product.description}</td>
                  <td className="p-3">
                    {categories.length > 0
                      ? (categories.find(c => c.id === product.category_id)?.name || 'Unknown')
                      : '...'}
                  </td>
                  <td className="p-3">{formatIDR(product.price)}</td>
                  <td className="p-3">{typeof product.stock_quantity === 'number' ? product.stock_quantity : (typeof product.stock === 'number' ? product.stock : 0)}</td>
                  <td className="p-3">
                    {product.is_active ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">Active</span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">Inactive</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded"
                      onClick={() => openModal("edit", product)}
                      disabled={submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded"
                      onClick={() => {
                        setDeleteId(product.id);
                        setDeleteModalOpen(true);
                      }}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                    {!product.is_active && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded"
                        onClick={() => handleReactivate(product.id)}
                        disabled={submitting}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 rounded bg-gray-200 font-bold text-gray-600 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => {
            if (pagination.current_page > 1) setPagination(p => ({ ...p, current_page: p.current_page - 1 }));
          }}
          disabled={pagination.current_page <= 1}
        >
          Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {pagination.current_page} of {pagination.pages}
        </span>
        <button
          className="px-4 py-2 rounded bg-gray-200 font-bold text-gray-600 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => {
            if (pagination.current_page < pagination.pages) setPagination(p => ({ ...p, current_page: p.current_page + 1 }));
          }}
          disabled={pagination.current_page >= pagination.pages}
        >
          Next
        </button>
      </div>

      {/* Modal for Add/Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-yellow-700">
              {modalMode === "add" ? "Add Product" : "Edit Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.name || ""}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.description || ""}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Price</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded px-3 py-2"
                    value={form.price || 0}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded px-3 py-2"
                    value={form.stock_quantity || 0}
                    onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Category</label>
                  {catLoading ? (
                    <div className="text-gray-400">Loading categories...</div>
                  ) : catError ? (
                    <div className="text-red-500">{catError}</div>
                  ) : (
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={form.category_id || categories[0]?.id || ''}
                      onChange={e => setForm(f => ({ ...f, category_id: Number(e.target.value) }))}
                      required
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.id} - {cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Min Order Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded px-3 py-2"
                    value={form.min_order_quantity || 1}
                    onChange={e => setForm(f => ({ ...f, min_order_quantity: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Tags <span className="text-xs text-gray-400">(comma separated, no brackets or quotes)</span></label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="eco-friendly, handmade, organic"
                  value={form.tags || ""}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Sustainability Attributes <span className="text-xs text-gray-400">(comma separated, no brackets or quotes)</span></label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="organic, carbon-neutral"
                  value={form.sustainability_attributes || ""}
                  onChange={e => setForm(f => ({ ...f, sustainability_attributes: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Images <span className="text-xs text-gray-500">(comma-separated URLs)</span></label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.png"
                  value={form.images || ""}
                  onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                />
                <div className="text-xs text-gray-500 mt-1">Enter one or more valid image URLs, separated by commas. Only valid URLs will be sent.</div>
              </div>
              <div>
                <label className="block font-medium mb-1">Primary Image URL <span className="text-xs text-gray-400">(must match one of the images)</span></label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.primary_image_url || ""}
                  onChange={e => setForm(f => ({ ...f, primary_image_url: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  id="is_active"
                />
                <label htmlFor="is_active" className="font-medium">Active</label>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded-lg disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? (modalMode === "add" ? "Adding..." : "Saving...") : (modalMode === "add" ? "Add Product" : "Save Changes")}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded hover:bg-gray-400"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
              {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
    <DeleteProductModal
      open={deleteModalOpen}
      productName={products.find(p => p.id === deleteId)?.name}
      onConfirm={() => deleteId && handleDelete(deleteId)}
      onCancel={() => { setDeleteModalOpen(false); setDeleteId(null); }}
      loading={submitting}
    />
    </>
  );
}

