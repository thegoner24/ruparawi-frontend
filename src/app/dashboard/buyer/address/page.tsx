"use client";
import React, { useEffect, useState } from "react";
import AddressCard, { Address } from "./AddressCard";
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress } from "@/app/controllers/addressController";
import { useAuth } from "@/app/context/AuthContext";

export default function AddressPage() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  async function refreshAddresses() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserAddresses(token);
      if (Array.isArray(data)) {
        setAddresses(data);
      } else if (data && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      } else if (data && Array.isArray(data.data)) {
        setAddresses(data.data);
      } else {
        setAddresses([]);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAddresses();
    // eslint-disable-next-line
  }, [token]);

  // CRUD handlers
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  function handleDelete(address: Address) {
    setDeleteTarget(address);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteUserAddress(deleteTarget.id, token);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      await refreshAddresses();
    } catch (e: any) {
      setActionError(e?.message || "Failed to delete address");
    } finally {
      setActionLoading(false);
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setActionError(null);
  }

  function handleEdit(address: Address) {
    setEditAddress(address);
    setShowModal(true);
  }

  async function handleModalSave(address: Partial<Address>) {
    if (!token) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (editAddress) {
        const fullPayload = {
          address_line1: address.address_line1 ?? editAddress.address_line1,
          city: address.city ?? editAddress.city,
          state: address.state ?? editAddress.state,
          postal_code: address.postal_code ?? editAddress.postal_code,
          country: address.country ?? editAddress.country,
          phone: address.phone ?? editAddress.phone,
          is_default: typeof address.isDefault === 'boolean' ? address.isDefault : editAddress.isDefault ?? false,
        };
        await updateUserAddress(editAddress.id, fullPayload, token);
      } else {
        await createUserAddress(address, token);
      }
      setShowModal(false);
      setEditAddress(null);
      await refreshAddresses();
    } catch (e: any) {
      if (e && e.response && typeof e.response.json === 'function') {
        try {
          const data = await e.response.json();
          setActionError(data?.message || data?.detail || "Failed to save address");
        } catch {
          setActionError((e?.message || (editAddress ? "Failed to update address" : "Failed to create address")));
        }
      } else {
        setActionError((e?.message || (editAddress ? "Failed to update address" : "Failed to create address")));
      }
    } finally {
      setActionLoading(false);
    }
  }

  function handleModalClose() {
    setShowModal(false);
    setEditAddress(null);
    setActionError(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-pink-600">My Addresses</h2>
        <button
          className="ml-auto px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow disabled:opacity-60"
          onClick={() => { setEditAddress(null); setShowModal(true); }}
        >
          + Add Address
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading addresses...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : addresses.length === 0 ? (
        <div className="text-gray-400">No addresses found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      {/* Address modal */}
      {showModal && (
        <AddressModal
          address={editAddress}
          onSave={handleModalSave}
          onClose={handleModalClose}
          loading={actionLoading}
          error={actionError}
        />
      )}
      {/* Delete confirmation modal */}
      {showDeleteModal && deleteTarget && (
        <DeleteAddressModal
          address={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={actionLoading}
          error={actionError}
        />
      )}
    </div>
  );
}

function DeleteAddressModal({ address, onConfirm, onCancel, loading, error }:{
  address: Address,
  onConfirm: () => void,
  onCancel: () => void,
  loading: boolean,
  error: string | null
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
        <h3 className="text-xl font-bold mb-2 text-pink-600">Delete Address</h3>
        <div className="text-gray-700">Are you sure you want to delete this address?</div>
        <div className="text-gray-500 text-sm">{address.address_line1}, {address.city}, {address.state}, {address.postal_code}, {address.country}</div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium" onClick={onCancel} disabled={loading}>Cancel</button>
          <button type="button" className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}


// AddressModal component
function AddressModal({ address, onSave, onClose, loading, error }:{
  address: Partial<Address> | null,
  onSave: (address: Partial<Address>) => void,
  onClose: () => void,
  loading: boolean,
  error: string | null
}) {
  const [form, setForm] = useState<Partial<Address>>(address || {});
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg space-y-4">
        <h3 className="text-xl font-bold mb-2 text-pink-600">{address ? 'Edit Address' : 'Add Address'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="address_line1" value={form.address_line1||''} onChange={handleChange} required placeholder="Address Line 1" className="border rounded px-3 py-2 md:col-span-2" />
          <input name="city" value={form.city||''} onChange={handleChange} required placeholder="City" className="border rounded px-3 py-2" />
          <input name="state" value={form.state||''} onChange={handleChange} required placeholder="State" className="border rounded px-3 py-2" />
          <input name="postal_code" value={form.postal_code||''} onChange={handleChange} required placeholder="Postal Code" className="border rounded px-3 py-2" />
          <input name="country" value={form.country||''} onChange={handleChange} required placeholder="Country" className="border rounded px-3 py-2" />
          <input name="phone" value={form.phone||''} onChange={handleChange} required placeholder="Phone" className="border rounded px-3 py-2" />
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
