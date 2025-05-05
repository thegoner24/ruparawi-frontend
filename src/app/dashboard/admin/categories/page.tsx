"use client";
import React, { useState, useEffect } from "react";
import { getCategories, createCategory, createSubcategory, updateCategory, deleteCategory, Category } from "@/app/controllers/categoryController";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [token]);

  function handleAdd() {
    setEditCategory(null);
    setShowModal(true);
    setModalError(null);
  }

  function handleEdit(category: Category) {
    setEditCategory(category);
    setParentCategory(null);
    setShowModal(true);
    setModalError(null);
  }

  function handleAddSubcategory(parent: Category) {
    setEditCategory(null);
    setParentCategory(parent);
    setShowModal(true);
    setModalError(null);
  }

  function handleDelete(category: Category) {
    setDeleteTarget(category);
    setDeleteLoading(false);
    setDeleteError(null);
  }

  async function handleModalSave(form: Partial<Category>) {
    if (!token) return;
    setModalLoading(true);
    setModalError(null);
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, form, token);
      } else if (parentCategory) {
        await createSubcategory(parentCategory.id, form, token);
      } else {
        await createCategory(form, token);
      }
      setShowModal(false);
      setParentCategory(null);
      await refresh();
    } catch (e: any) {
      setModalError(e?.message || "Failed to save category");
    } finally {
      setModalLoading(false);
    }
  }

  async function confirmDelete() {
    if (!token || !deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteCategory(deleteTarget.id, token);
      setDeleteTarget(null);
      await refresh();
    } catch (e: any) {
      setDeleteError(e?.message || "Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold text-pink-700">Category Management</h1>
        <button
          className="ml-auto px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow disabled:opacity-60"
          onClick={handleAdd}
        >
          + Add Category
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading categories...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : categories.length === 0 ? (
        <div className="text-gray-400">No categories found.</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-pink-50">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={cat.id}>
                <tr className="border-b last:border-b-0">
                  <td className="p-3 font-semibold">{cat.name}</td>
                  <td className="p-3">{cat.description || <span className="text-gray-400">-</span>}</td>
                  <td className="p-3">
                    {cat.is_active ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs">Inactive</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm" onClick={() => handleEdit(cat)}>Edit</button>
                    <button className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 text-sm" onClick={() => handleDelete(cat)}>Delete</button>
                    <button className="px-3 py-1 rounded bg-pink-100 hover:bg-pink-200 text-pink-600 text-sm" onClick={() => handleAddSubcategory(cat)}>+ Add Subcategory</button>
                  </td>
                </tr>
                {/* Render subcategories if present */}
                {Array.isArray((cat as any).subcategories) && (cat as any).subcategories.length > 0 &&
                  (cat as any).subcategories.map((sub: any) => (
                    <tr key={sub.id} className="border-b last:border-b-0 bg-gray-50">
                      <td className="p-3 pl-8 flex items-center gap-2">
                        <span className="text-xs text-gray-400">↳</span> <span className="font-medium">{sub.name}</span>
                      </td>
                      <td className="p-3">{sub.description || <span className="text-gray-400">-</span>}</td>
                      <td className="p-3">
                        {sub.is_active ? (
                          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Active</span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs">Inactive</span>
                        )}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm" onClick={() => handleEdit(sub)}>Edit</button>
                        <button className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 text-sm" onClick={() => handleDelete(sub)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      {/* Add/Edit Modal */}
      {showModal && (
        <CategoryModal
          category={editCategory}
          onSave={handleModalSave}
          onClose={() => setShowModal(false)}
          loading={modalLoading}
          error={modalError}
        />
      )}
      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteCategoryModal
          category={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </div>
  );
}

function CategoryModal({ category, onSave, onClose, loading, error }:{
  category: Category | null,
  onSave: (cat: Partial<Category>) => void,
  onClose: () => void,
  loading: boolean,
  error: string | null
}) {
  const [form, setForm] = useState<Partial<Category>>(category || { is_active: true });
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value
    }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg space-y-4">
        <h3 className="text-xl font-bold mb-2 text-pink-600">{category ? 'Edit Category' : 'Add Category'}</h3>
        <div className="grid grid-cols-1 gap-4">
          <input name="name" value={form.name||''} onChange={handleChange} required placeholder="Category Name" className="border rounded px-3 py-2" />
          <textarea name="description" value={form.description||''} onChange={handleChange} placeholder="Description (optional)" className="border rounded px-3 py-2 min-h-[60px]" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_active" checked={form.is_active ?? true} onChange={handleChange} />
            <span>Active</span>
          </label>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white font-semibold disabled:opacity-60" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}

function DeleteCategoryModal({ category, onConfirm, onCancel, loading, error }:{
  category: Category,
  onConfirm: () => void,
  onCancel: () => void,
  loading: boolean,
  error: string | null
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
        <h3 className="text-xl font-bold mb-2 text-pink-600">Delete Category</h3>
        <div className="text-gray-700">Are you sure you want to delete this category?</div>
        <div className="text-gray-500 text-sm">{category.name}</div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium" onClick={onCancel} disabled={loading}>Cancel</button>
          <button type="button" className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}

