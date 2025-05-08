"use client";
import { FaBoxOpen, FaHeart, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/app/controllers/authController";
// import AddressCard from "./AddressCard"; // Not needed here

import { useEffect, useState } from "react";

export default function BuyerDashboard() {
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number | null>(null);
  const [addressCount, setAddressCount] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const fetchOptions = {
      headers,
      credentials: "include" as RequestCredentials,
    };

    fetch(`${API_BASE_URL}/order`, fetchOptions)
      .then(res => res.json())
      .then(data => setOrderCount(data.count));

    fetch(`${API_BASE_URL}/wishlist`, fetchOptions)
      .then(res => res.json())
      .then(data => setWishlistCount(data.count));

    fetch(`${API_BASE_URL}/addresses`, fetchOptions)
      .then(res => res.json())
      .then(data => setAddressCount(data.count));
  }, []);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const fetchOptions = {
      headers,
      credentials: "include" as RequestCredentials,
    };
    // Fetch recent orders (limit to 3 most recent)
    fetch(`${API_BASE_URL}/order`, fetchOptions)
      .then(res => res.json())
      .then(data => {
        let orders = Array.isArray(data.orders) ? data.orders : (Array.isArray(data) ? data : []);
        // Sort by created_at descending if possible
        orders = orders.sort((a: any, b: any) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        setRecentOrders(orders.slice(0, 3));
      });
    // ...existing stats fetches
    fetch(`${API_BASE_URL}/order`, fetchOptions)
      .then(res => res.json())
      .then(data => setOrderCount(data.count));
    fetch(`${API_BASE_URL}/wishlist`, fetchOptions)
      .then(res => res.json())
      .then(data => setWishlistCount(data.count));
    fetch(`${API_BASE_URL}/addresses`, fetchOptions)
      .then(res => res.json())
      .then(data => setAddressCount(data.count));
  }, []);

  const stats = [
    {
      label: "Orders",
      value: orderCount ?? "-",
      icon: <FaBoxOpen className="text-3xl text-blue-500" />,
      href: "/dashboard/buyer/orders",
      color: "bg-blue-100"
    },
    {
      label: "Wishlist",
      value: wishlistCount ?? "-",
      icon: <FaHeart className="text-3xl text-pink-500" />,
      href: "/dashboard/buyer/wishlist",
      color: "bg-pink-100"
    },
    {
      label: "Addresses",
      value: addressCount ?? "-",
      icon: <FaMapMarkerAlt className="text-3xl text-green-500" />,
      href: "/dashboard/buyer/address",
      color: "bg-green-100"
    },
    {
      label: "Become a Vendor",
      value: '',
      icon: <FaUser className="text-3xl text-yellow-600" />,
      href: "/vendor-apply",
      color: "bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className={`flex items-center gap-4 p-5 rounded-xl shadow hover:shadow-lg transition ${stat.color}`}
          >
            <div>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-700">{stat.label}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <ul className="divide-y divide-gray-200">
          {recentOrders.length === 0 ? (
            <li className="py-3 text-gray-400">No recent orders found.</li>
          ) : (
            recentOrders.map((order) => (
              <li key={order.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-medium text-gray-800">
                  Order #{order.order_number || order.id} - {order.status || 'Status Unknown'}
                </span>
                <span className="text-sm text-gray-500">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}