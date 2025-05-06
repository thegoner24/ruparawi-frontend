"use client";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/controllers/authController";

export interface ApidogModel {
  recent_orders: RecentOrder[];
  success: boolean;
  [property: string]: any;
}

export interface RecentOrder {
  customer: string;
  image_url: string;
  order_date: string;
  order_id: number;
  order_status: string;
  product: string;
  qty: number;
  total: number;
  [property: string]: any;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
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

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE_URL}/vendor/recent-orders`, { headers });
        if (!res.ok) throw new Error("Failed to fetch recent orders");
        const data = await res.json();
        setOrders(Array.isArray(data.recent_orders) ? data.recent_orders : []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-yellow-700 font-bold">Recent Orders</h2>
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        {loading && <div className="text-gray-400 py-8 text-center">Loading recent orders...</div>}
        {error && <div className="text-red-500 py-8 text-center">{error}</div>}
        {!loading && !error && (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-yellow-50">
                <th className="p-3 text-left">Order ID</th>
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
              {orders.map((order, idx) => (
                <tr key={`${order.order_id}-${order.order_date}-${idx}`} className="border-b hover:bg-yellow-50 transition">
                  <td className="p-3 font-mono text-yellow-700 font-semibold">{order.order_id}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">{order.qty}</td>
                  <td className="p-3">{formatIDR(order.total)}</td>
                  <td className="p-3 text-sm text-gray-500">{order.customer}</td>
                  <td className="p-3 text-xs text-gray-400">{formatDate(order.order_date)}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusStyles[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-500"}`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
