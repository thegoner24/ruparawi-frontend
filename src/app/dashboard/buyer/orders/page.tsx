import { FaSearch, FaBoxOpen, FaTruck, FaUndo } from "react-icons/fa";
import React from "react";

type Order = {
  id: string;
  date: string;
  status: "Shipped" | "Delivered" | "Returned";
  amount: number;
  items: number;
};

const orders: Order[] = [
  {
    id: "ORD-1001",
    date: "2025-05-01",
    status: "Shipped",
    amount: 120.99,
    items: 2,
  },
  {
    id: "ORD-1000",
    date: "2025-04-27",
    status: "Delivered",
    amount: 89.5,
    items: 1,
  },
  {
    id: "ORD-0999",
    date: "2025-04-20",
    status: "Returned",
    amount: 49.99,
    items: 1,
  },
];

function getOrderIcon(status: Order["status"]) {
  if (status === "Shipped") return <FaTruck className="text-green-500" />;
  if (status === "Delivered") return <FaBoxOpen className="text-blue-500" />;
  if (status === "Returned") return <FaUndo className="text-red-500" />;
  return null;
}

export default function OrdersPage() {
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
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-mono flex items-center gap-2">
                  {getOrderIcon(order.status)}
                  <span>{order.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Shipped' ? 'bg-green-100 text-green-700' : order.status === 'Delivered' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">${order.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">{order.items}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-400">No orders found.</div>
        )}
      </div>
    </div>
  );
}
