"use client";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/controllers/authController";

export interface ApidogModel {
  recent_orders: RecentOrder[];
  success: boolean;
  [property: string]: any;
}

interface RecentOrder {
  customer: string;
  image_url: null;
  order_date: string;
  order_id: number;
  order_number: string;
  order_status: string;
  product: string;
  qty: number;
  total: number;
  [property: string]: any;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-purple-100 text-purple-700",
  completed: "bg-green-200 text-green-800",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatIDR(amount: string | number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(amount));
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{orderNumber: string, currentStatus: string} | null>(null);
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'completed'];

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
        const params = new URLSearchParams();
        if (filter !== 'all') params.append('status', filter);
        params.append('page', String(page));
        params.append('per_page', String(pageSize));
        const res = await fetch(`${API_BASE_URL}/vendor/recent-orders?${params.toString()}`, { headers });
        if (!res.ok) throw new Error("Failed to fetch recent orders");
        const data = await res.json();
        setOrders(Array.isArray(data.recent_orders) ? data.recent_orders : []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [filter, page, pageSize]);

  // If this import fails, define the interface inline below
// import type { Order } from "@/app/dashboard/buyer/orders/ordersApi";
interface Order {
  created_at: string;
  id: number;
  items: string;
  order_number: string;
  category_name: string;
  status: string;
  status_history: string;
  total_amount: number;
  [property: string]: any;
}
type UpdateOrderStatusResponse = {
  success: boolean;
  message?: string;
  order: Order;
};

async function handleUpdateStatus(orderNumber: string, newStatus: string) {
  if (!orderNumber) {
    alert('Order number is missing. Cannot update status.');
    return;
  }
  console.log('Updating order status:', orderNumber, newStatus);
  setUpdatingOrderId(orderNumber);
  try {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${API_BASE_URL}/order/${orderNumber}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status: newStatus }), // match backend
    });
    const data: UpdateOrderStatusResponse = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to update order status");
    // Optionally update the order in state here if desired
    setStatusModal(null);
    setTimeout(() => setUpdatingOrderId(null), 300);
    // Re-fetch orders
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('status', filter);
    params.append('page', String(page));
    params.append('per_page', String(pageSize));
    const refetchRes = await fetch(`${API_BASE_URL}/vendor/recent-orders?${params.toString()}`, { headers });
    if (!refetchRes.ok) throw new Error("Failed to fetch recent orders");
    const ordersData = await refetchRes.json();
    setOrders(Array.isArray(ordersData.recent_orders) ? ordersData.recent_orders : []);
    setTotalPages(ordersData.pagination?.pages || 1);
    setLoading(false);
  } catch (err: any) {
    setError(err.message || "Unknown error");
    setUpdatingOrderId(null);
  }
}

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-yellow-700 font-bold">Recent Orders</h2>
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        {/* Filter, Pagination, and Status Modal UI */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          {/* Filter Dropdown */}
          <div>
            <label className="mr-2 font-semibold text-sm text-gray-700">Filter by Status:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filter}
              onChange={e => { setPage(1); setFilter(e.target.value); }}
            >
              <option value="all">All</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>
          {/* Pagination Controls */}
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >Prev</button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >Next</button>
          </div>
        </div>
        {loading && <div className="text-gray-400 py-8 text-center">Loading recent orders...</div>}
        {error && <div className="text-red-500 py-8 text-center">{error}</div>}
        {!loading && !error && (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-yellow-50">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Order Number</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">No recent orders found.</td>
                </tr>
              )}
              {orders.map((order, idx) => {
                const realOrderNumber = order.order_number; // Always a string per new interface
                return (
                  <tr key={`${realOrderNumber}-${order.order_date}-${idx}`} className="border-b hover:bg-yellow-50 transition">
                    <td className="p-3 font-mono text-yellow-700 font-semibold">{order.order_id}</td>
                    <td className="p-3 font-mono text-blue-700 font-semibold">{realOrderNumber || <span className="text-red-600">Missing!</span>}</td>
                    <td className="p-3">{order.product}</td>
                    <td className="p-3">{order.qty}</td>
                    <td className="p-3">{formatIDR(order.total)}</td>
                    <td className="p-3 text-sm text-gray-500">{order.customer}</td>
                    <td className="p-3 text-xs text-gray-400">{formatDate(order.order_date)}</td>
                    <td className="p-3 flex flex-col gap-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusStyles[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-500"}`}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                      <button
                        className="mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        disabled={updatingOrderId === realOrderNumber || !realOrderNumber || realOrderNumber === ""}
                        onClick={() => {
                          if (!realOrderNumber || realOrderNumber === "") {
                            alert('Order number missing for this order. Cannot update status.');
                            return;
                          }
                          setStatusModal({ orderNumber: realOrderNumber, currentStatus: order.order_status });
                        }}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* Status Update Modal */}
        {statusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xs relative animate-fade-in">
              <h3 className="text-lg font-bold mb-4 text-blue-700">Update Order Status</h3>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Select new status:</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  defaultValue={statusModal.currentStatus}
                  onChange={e => setStatusModal(sm => sm ? { ...sm, currentStatus: e.target.value } : sm)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => setStatusModal(null)}
                  disabled={updatingOrderId === statusModal.orderNumber}
                >Cancel</button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded disabled:opacity-60"
                  onClick={() => handleUpdateStatus(statusModal.orderNumber, statusModal.currentStatus)}
                  disabled={updatingOrderId === statusModal.orderNumber}
                >{updatingOrderId === statusModal.orderNumber ? "Updating..." : "Update"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
