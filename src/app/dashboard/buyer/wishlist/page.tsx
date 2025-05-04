"use client";
import { FaSearch, FaHeart, FaCartPlus, FaTrash, FaSyncAlt, FaRegSadTear } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getWishlist, removeFromWishlist } from "@/app/controllers/wishlistController";

function Toast({ message, type, onClose }: { message: string, type: 'success'|'error', onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-8 right-8 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all animate-fade-in ${type==='success'?'bg-green-500':'bg-red-500'}`}>
      {message}
    </div>
  );
}


type WishlistItem = {
  id: number;
  name: string;
  price: number;
  dateAdded: string;
  inStock: boolean;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Toast state
  const [toast, setToast] = useState<{ message: string, type: 'success'|'error'}|null>(null);

  // Manual refresh handler
  const refreshWishlist = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getWishlist(token);
      if (Array.isArray(data)) {
        setWishlist(data);
      } else if (data && data.wishlist && Array.isArray(data.wishlist.products)) {
        setWishlist(data.wishlist.products);
      } else if (data && Array.isArray(data.wishlist)) {
        setWishlist(data.wishlist);
      } else if (data && Array.isArray(data.data)) {
        setWishlist(data.data);
      } else {
        setWishlist([]);
      }
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to refresh wishlist');
      setToast({ message: e?.message || 'Failed to refresh wishlist', type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const { token } = useAuth();

  useEffect(() => {
    async function fetchWishlist(token: string) {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error('No auth token found. Please log in.');
        const data = await getWishlist(token);
        console.log("Fetched wishlist data:", data);
        // Ensure wishlist is always an array
        if (Array.isArray(data)) {
          setWishlist(data);
        } else if (data && data.wishlist && Array.isArray(data.wishlist.products)) {
          setWishlist(data.wishlist.products);
        } else if (data && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
        } else if (data && Array.isArray(data.data)) {
          setWishlist(data.data);
        } else {
          setWishlist([]);
        }
      } catch (e: unknown) {
        if (e && typeof e === "object" && "message" in e && typeof (e as any).message === "string") {
          setError((e as any).message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchWishlist(token);
  }, [token]);

  // Confirmation modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  function openConfirmDelete(id: number, name: string) {
    setConfirmDeleteId(id);
    setConfirmDeleteName(name);
  }
  function closeConfirmDelete() {
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  }

  async function handleDelete(id: number) {
    // called after user confirms in popup
    setDeletingId(id);
    closeConfirmDelete();
    try {
      if (!token) throw new Error('No auth token found. Please log in.');
      await removeFromWishlist(id, token);
      setToast({ message: 'Item removed from wishlist', type: 'success' });
      // Refresh wishlist from server
      await refreshWishlist();
    } catch (e: any) {
      setToast({ message: e?.message || 'Error deleting item', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  }

  const filteredWishlist = wishlist.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <FaHeart className="text-pink-500" /> Wishlist
          </h2>
          <p className="text-gray-600">See items you have saved for later purchase.</p>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <button
            onClick={refreshWishlist}
            className="flex items-center gap-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium shadow-sm transition disabled:opacity-60"
            disabled={loading}
            title="Refresh wishlist"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search wishlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div> 
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading wishlist...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWishlist.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.dateAdded}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.inStock ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">In Stock</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center gap-4">
                      <button
                        className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600"
                        title="Add to Cart"
                        disabled={!item.inStock}
                      >
                        <FaCartPlus />
                      </button>
                      <button
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 disabled:opacity-50"
                        title="Remove from Wishlist"
                        onClick={() => openConfirmDelete(item.id, item.name)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWishlist.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <FaRegSadTear className="text-5xl mb-2" />
                <div className="text-lg font-medium">Your wishlist is empty.</div>
                <div className="text-sm">Browse products and add them to your wishlist!</div>
              </div>
            )}
          </>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

{/* Delete confirmation modal */}
{confirmDeleteId !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
      <div className="text-2xl mb-2 text-pink-600"><FaTrash /></div>
      <h3 className="text-lg font-bold mb-2">Remove from Wishlist?</h3>
      <p className="mb-4 text-gray-600">
        Are you sure you want to remove <span className="font-semibold text-gray-800">{confirmDeleteName}</span> from your wishlist?
      </p>
      <div className="flex gap-4 justify-center">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
          onClick={closeConfirmDelete}
          disabled={deletingId === confirmDeleteId}
        >Cancel</button>
        <button
          className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white font-medium disabled:opacity-60"
          onClick={() => handleDelete(confirmDeleteId)}
          disabled={deletingId === confirmDeleteId}
        >{deletingId === confirmDeleteId ? 'Removing...' : 'Remove'}</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
