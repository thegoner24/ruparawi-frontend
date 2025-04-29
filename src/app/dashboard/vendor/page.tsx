"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Sidebar navigation items for vendor dashboard
const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard/vendor" },
  { label: "Products", href: "/dashboard/vendor/products" },
  { label: "Orders", href: "/dashboard/vendor/orders" },
  { label: "Earnings", href: "/dashboard/vendor/earnings" },
  { label: "Profile", href: "/profile" },
];

export default function VendorDashboard() {
  // Placeholder stats (replace with real data)
  const stats = [
    { label: "Total Sales", value: "$5,200" },
    { label: "Orders", value: "128" },
    { label: "Products", value: "24" },
    { label: "Earnings", value: "$1,340" },
  ];

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#bfa76a] mb-8 tracking-tight">Vendor Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-[#f6f3ea] hover:text-[#bfa76a] font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <Link href="/" className="text-blue-700 hover:underline">Return to Store</Link>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Welcome, Vendor!</h1>
          <Link href="/dashboard/vendor/products" className="px-5 py-2 bg-[#bfa76a] text-white rounded-full font-semibold shadow hover:bg-[#a28d4f] transition">Add Product</Link>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-5 flex flex-col items-center border border-[#f0e9d6]">
              <span className="text-sm text-gray-500 mb-1">{stat.label}</span>
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Placeholder for main dashboard widgets */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="bg-white rounded-xl p-8 shadow border border-[#f0e9d6] min-h-[300px] flex flex-col items-center justify-center"
        >
          <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
          <p className="text-gray-600 text-center max-w-xl">
            Here you can manage your products, track orders, and view your earnings. Use the sidebar to navigate between different sections of your vendor account. More features coming soon!
          </p>
        </motion.div>
      </section>
    </main>
  );
}
