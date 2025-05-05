"use client";
import { useEffect, useState } from "react";
import {
  fetchPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
  PaymentMethod,
} from "./paymentMethodsApi";

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<PaymentMethod>>({
    payment_type: "",
    provider: "",
    account_number: "",
    expiry_date: "",
    is_default: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMethods();
  }, []);

  async function loadMethods() {
    setLoading(true);
    setError("");
    try {
      setMethods(await fetchPaymentMethods());
    } catch (err: any) {
      setError(err?.message || "Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    // Validate all fields before submitting
    if (
      !form.payment_type ||
      !form.provider ||
      !form.account_number ||
      !form.expiry_date ||
      typeof form.is_default !== "boolean"
    ) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }
    try {
      if (editingId) {
        await updatePaymentMethod(editingId, form);
      } else {
        await addPaymentMethod(form);
      }
      setForm({ payment_type: "", provider: "", account_number: "", expiry_date: "", is_default: false });
      setEditingId(null);
      await loadMethods();
    } catch (err: any) {
      setError(err?.message || "Failed to save payment method");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this payment method?")) return;
    setSubmitting(true);
    setError("");
    try {
      await deletePaymentMethod(id);
      await loadMethods();
    } catch (err: any) {
      setError(err?.message || "Failed to delete payment method");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(method: PaymentMethod) {
    setForm(method);
    setEditingId(method.id);
  }

  function handleCancel() {
    setForm({ payment_type: "", provider: "", account_number: "", expiry_date: "", is_default: false });
    setEditingId(null);
  }

  return (
    <section className="bg-white rounded shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {methods.length === 0 && <li className="text-gray-500">No payment methods found.</li>}
            {methods.map((method) => (
              <li key={method.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-black">{method.payment_type} - {method.provider}</div>
                  <div className="text-sm text-gray-600">Account: {method.account_number}</div>
                  <div className="text-sm text-gray-600">Expiry: {method.expiry_date}</div>
                  <div className="text-sm text-gray-600">{method.is_default ? <span className="text-green-600 font-semibold">Default</span> : ""}</div>
                </div>
                <div className="mt-2 md:mt-0 flex gap-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={() => handleEdit(method)} disabled={submitting}>Edit</button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => handleDelete(method.id)} disabled={submitting}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-lg font-semibold mb-2">{editingId ? "Edit Payment Method" : "Add Payment Method"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="payment_type"
                placeholder="Payment Type (e.g., Credit Card, Bank)"
                className="border rounded px-3 py-2"
                value={form.payment_type || ""}
                onChange={handleInput}
                required
              />
              <input
                type="text"
                name="provider"
                placeholder="Provider (e.g., BCA, Visa)"
                className="border rounded px-3 py-2"
                value={form.provider || ""}
                onChange={handleInput}
                required
              />
              <input
                type="text"
                name="account_number"
                placeholder="Account Number"
                className="border rounded px-3 py-2"
                value={form.account_number || ""}
                onChange={handleInput}
                required
              />
              <input
                type="text"
                name="expiry_date"
                placeholder="Expiry Date (e.g., 12/2025)"
                className="border rounded px-3 py-2"
                value={form.expiry_date || ""}
                onChange={handleInput}
                required
              />
              <label className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={!!form.is_default}
                  onChange={handleInput}
                />
                <span>Set as default payment method</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Save Changes" : "Add Method")}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </section>
  );
}
