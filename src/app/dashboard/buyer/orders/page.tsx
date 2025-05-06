"use client";
import { FaSearch, FaBoxOpen, FaTruck, FaUndo } from "react-icons/fa";
import React from "react";

import { fetchOrders, Order } from "./ordersApi";



function getOrderIcon(status: Order["status"]) {
  if (status === "Shipped") return <FaTruck className="text-green-500" />;
  if (status === "Delivered") return <FaBoxOpen className="text-blue-500" />;
  if (status === "Returned") return <FaUndo className="text-red-500" />;
  return null;
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => setError("Failed to fetch orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Orders</h2>
          <p className="text-gray-600">View and manage your recent orders below.</p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading orders...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Product(s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-mono flex items-center gap-2">
                      {getOrderIcon(order.status)}
                      <span>{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Shipped' ? 'bg-green-100 text-green-700' : order.status === 'Delivered' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{order.total_amount?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{(() => {
                      try {
                        // Fix Python-style string to valid JSON
                        let fixed = order.items
                          .replace(/'/g, '"')
                          .replace(/\bNone\b/g, 'null');
                        const items = JSON.parse(fixed);
                        if (!Array.isArray(items) || items.length === 0) return '-';
                        return items.map((item: any) => item.name).filter(Boolean).join(', ');
                      } catch {
                        return '-';
                      }
                    })()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="p-8 text-center text-gray-400">No orders found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
