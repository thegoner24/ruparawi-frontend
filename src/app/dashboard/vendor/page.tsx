"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Fallback SVG icons (replace with @heroicons/react/outline if installed)
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}><rect x="3" y="6" width="14" height="2" rx="1" fill="currentColor"/><rect x="3" y="12" width="14" height="2" rx="1" fill="currentColor"/></svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}><polyline points="12 6 8 10 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}><polyline points="8 6 12 10 8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);


const sidebarLinks = [
  { label: "Dashboard" },
  { label: "Products" },
  { label: "Orders" },
  { label: "Earnings" },
  { label: "Profile" },
];

// Inline components for each section
const DashboardOverview = ({ stats }: { stats: { label: string; value: string }[] }) => (
  <>
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Welcome, Vendor!</h1>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-5 flex flex-col items-center border border-[#f0e9d6]">
          <span className="text-sm text-gray-500 mb-1">{stat.label}</span>
          <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
        </div>
      ))}
    </div>
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
  </>
);

const sampleProducts = [
  { id: 1, name: "Coffee Beans", price: 12.5, stock: 42 },
  { id: 2, name: "Espresso Machine", price: 340, stock: 7 },
  { id: 3, name: "Reusable Cup", price: 9.99, stock: 120 },
];
const ProductsSection = () => (
  <>
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-2">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Product Management</h1>
      <button className="px-5 py-2 bg-[#bfa76a] text-white rounded-full font-semibold shadow hover:bg-[#a28d4f] transition">Add Product</button>
    </header>
    <div className="overflow-x-auto rounded-lg shadow bg-white border border-[#f0e9d6]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#f6f3ea]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sampleProducts.map(product => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                <button className="text-blue-600 hover:underline text-sm">Edit</button>
                <button className="text-red-600 hover:underline text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const sampleOrders = [
  { id: 101, buyer: "Alice", product: "Coffee Beans", amount: 2, total: 25, status: "Pending" },
  { id: 102, buyer: "Bob", product: "Espresso Machine", amount: 1, total: 340, status: "Shipped" },
  { id: 103, buyer: "Charlie", product: "Reusable Cup", amount: 4, total: 39.96, status: "Delivered" },
];
const OrdersSection = () => (
  <>
    <header className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
    </header>
    <div className="overflow-x-auto rounded-lg shadow bg-white border border-[#f0e9d6]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#f6f3ea]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Buyer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sampleOrders.map(order => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.buyer}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : order.status === "Shipped" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{order.status}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-blue-600 hover:underline text-sm">Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const earningsSummary = {
  total: 1340,
  month: 320,
  lastPayout: "2025-04-20",
};
const recentTransactions = [
  { id: 1, date: "2025-04-28", amount: 120, description: "Order #101" },
  { id: 2, date: "2025-04-27", amount: 80, description: "Order #102" },
  { id: 3, date: "2025-04-26", amount: 50, description: "Order #103" },
];
const EarningsSection = () => (
  <>
    <header className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Earnings</h1>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-5 border border-[#f0e9d6]">
        <div className="text-sm text-gray-500 mb-1">Total Earnings</div>
        <div className="text-2xl font-bold text-gray-900">${earningsSummary.total}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-5 border border-[#f0e9d6]">
        <div className="text-sm text-gray-500 mb-1">This Month</div>
        <div className="text-2xl font-bold text-gray-900">${earningsSummary.month}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-5 border border-[#f0e9d6]">
        <div className="text-sm text-gray-500 mb-1">Last Payout</div>
        <div className="text-xl font-semibold text-gray-800">{earningsSummary.lastPayout}</div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-6 border border-[#f0e9d6]">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <ul className="divide-y divide-gray-100">
        {recentTransactions.map(tx => (
          <li key={tx.id} className="py-3 flex justify-between items-center">
            <span className="text-gray-700">{tx.description}</span>
            <span className="text-gray-500 text-sm">{tx.date}</span>
            <span className="font-semibold text-green-700">+${tx.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  </>
);

// Advanced Profile Section
import React, { useRef } from "react";
const ProfileSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    storeName: "",
    storeDescription: "",
    notifications: {
      orderUpdates: true,
      promotions: false,
      payoutAlerts: true,
    },
    profilePhoto: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith("notifications.")) {
      // Only checkboxes for notifications
      const key = name.split(".")[1];
      const checked = (e.target as HTMLInputElement).checked;
      setForm(f => ({ ...f, notifications: { ...f.notifications, [key]: checked } }));
    } else if (name === "profilePhoto" && (e.target as HTMLInputElement).files) {
      const file = (e.target as HTMLInputElement).files![0];
      setForm(f => ({ ...f, profilePhoto: file }));
      setPhotoPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setSuccess(false);
  };


  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true); // Placeholder for API integration
  };

  const handleDelete = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 4000);
    } else {
      // Placeholder for real delete logic
      alert("Account deleted! (not actually deleted)");
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Advanced Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-2">Update your credentials and store settings below.</p>
      </header>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 border border-[#f0e9d6] flex flex-col gap-8">
        {/* Profile Photo */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile Preview" className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400 text-xl">👤</span>
              )}
            </div>
            <button type="button" onClick={handlePhotoClick} className="px-3 py-1 bg-[#bfa76a] text-white rounded font-medium shadow hover:bg-[#a28d4f] transition">Change Photo</button>
            <input
              ref={fileInputRef}
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        </div>
        {/* Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6]"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6]"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              autoComplete="street-address"
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6]"
              placeholder="Your address"
            />
          </div>
        </div>
        {/* Store Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="storeName">Store Name</label>
              <input
                id="storeName"
                name="storeName"
                type="text"
                value={form.storeName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6]"
                placeholder="Your store name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="storeDescription">Store Description</label>
              <textarea
                id="storeDescription"
                name="storeDescription"
                value={form.storeDescription}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6] min-h-[56px]"
                placeholder="Describe your store"
              />
            </div>
          </div>
        </div>
        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full border border-gray-200 rounded-md px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-[#f9f8f6]"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-sm text-gray-500 hover:text-[#bfa76a]"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {/* Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="notifications.orderUpdates"
                checked={form.notifications.orderUpdates}
                onChange={handleChange}
                className="accent-[#bfa76a]"
              />
              Order Updates
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="notifications.promotions"
                checked={form.notifications.promotions}
                onChange={handleChange}
                className="accent-[#bfa76a]"
              />
              Promotions
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="notifications.payoutAlerts"
                checked={form.notifications.payoutAlerts}
                onChange={handleChange}
                className="accent-[#bfa76a]"
              />
              Payout Alerts
            </label>
          </div>
        </div>
        {/* Save & Delete */}
        <div className="flex items-center justify-between gap-4 mt-2">
          <button type="submit" className="px-5 py-2 bg-[#bfa76a] text-white rounded-full font-semibold shadow hover:bg-[#a28d4f] transition">Save Changes</button>
          <button
            type="button"
            className="px-5 py-2 bg-red-100 text-red-700 rounded-full font-semibold shadow hover:bg-red-200 transition"
            onClick={handleDelete}
          >
            {deleteConfirm ? "Are you sure? Click again to confirm." : "Delete Account"}
          </button>
        </div>
        {success && <p className="text-green-600 text-sm mt-2">Profile updated! (not yet saved to backend)</p>}
      </form>
    </div>
  );
};

import { useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function VendorDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen] = useState(true); // always true for desktop, but AnimatePresence expects a boolean
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const stats = [
    { label: "Total Sales", value: "$5,200" },
    { label: "Orders", value: "128" },
    { label: "Products", value: "24" },
    { label: "Earnings", value: "$1,340" },
  ];

  // Analytics chart data by range
  const [analyticsRange, setAnalyticsRange] = useState<'day' | 'month' | 'year'>('day');
  const analyticsData = {
    day: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [1200, 2100, 800, 1600, 2400, 2000, 2800],
    },
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [12000, 15000, 11000, 17000, 21000, 19500, 23000, 18000, 22000, 25000, 24000, 26000],
    },
    year: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      data: [120000, 135000, 128000, 142000, 155000],
    },
  };

  // Simulate fetching the username (replace with real API call if needed)
  useEffect(() => {
    // Example: fetch('/api/auth/profile').then(...)
    setTimeout(() => {
      setUsername("Alice"); // Replace with real username from API
    }, 500);
  }, []);

  return (
    <main className="flex min-h-screen bg-gray-50 relative">
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-white border border-gray-200 rounded-full p-2 shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-6 w-6 text-[#bfa76a]" />
      </button>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col p-6"
            >
              <button
                className="absolute top-4 right-4"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <XIcon className="h-6 w-6 text-[#bfa76a]" />
              </button>
              <h2 className="text-2xl font-bold text-[#bfa76a] mb-8 tracking-tight">Vendor Dashboard</h2>
              <nav className="flex flex-col gap-2">
                {sidebarLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => { setActiveSection(link.label); setMobileOpen(false); }}
                    className={`px-4 py-2 rounded-md text-left text-gray-700 font-medium transition ${activeSection === link.label ? 'bg-[#f6f3ea] text-[#bfa76a]' : 'hover:bg-[#f6f3ea] hover:text-[#bfa76a]'}`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-10">
                <a href="/" className="text-blue-700 hover:underline">Return to Store</a>
              </div>
            </motion.div>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
      {/* Desktop Sidebar Column */}
      <div className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex flex-col h-full bg-white border-r border-gray-200 p-6 z-20 ${collapsed ? 'w-20' : 'w-64'}`}
              style={{ minHeight: '100vh' }}
            >
              <button
                className="absolute top-4 right-4 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition"
                onClick={() => setCollapsed((c: boolean) => !c)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <ChevronRightIcon className="h-5 w-5 text-[#bfa76a]" /> : <ChevronLeftIcon className="h-5 w-5 text-[#bfa76a]" />}
              </button>
              {/* User Avatar */}
              <div className="flex flex-col items-center mt-2 mb-6">
                <img
                  src="https://www.gravatar.com/avatar/?d=mp&s=96"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-[#bfa76a] bg-gray-100 object-cover"
                />
              </div>
              <h2 className={`text-2xl font-bold text-[#bfa76a] mb-8 tracking-tight transition-all duration-200 ${collapsed ? 'opacity-0 w-0 h-0 mb-0' : ''}`}>
                {username ? `${username}'s Dashboard` : 'Dashboard'}
              </h2>
              <nav className="flex flex-col gap-2">
                {sidebarLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => setActiveSection(link.label)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-left text-gray-700 font-medium transition ${activeSection === link.label ? 'bg-[#f6f3ea] text-[#bfa76a]' : 'hover:bg-[#f6f3ea] hover:text-[#bfa76a]'} ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    {/* Optionally add icons here for collapsed mode */}
                    <span className={`transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{link.label}</span>
                  </button>
                ))}
              </nav>
              <div className={`mt-auto pt-10 transition-all duration-200 ${collapsed ? 'opacity-0 h-0' : ''}`}>
                <a href="/" className="text-blue-700 hover:underline">Return to Store</a>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      {/* Main Content */}
      <section className="flex-1 flex flex-col p-6">
        {activeSection === "Dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                  <span className="text-gray-500 text-sm mb-2">{stat.label}</span>
                  <span className="text-2xl font-bold text-[#bfa76a]">{stat.value}</span>
                </div>
              ))}
            </div>
            {/* Analytics Chart */}
            <div className="bg-white rounded-xl p-6 shadow mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Sales Analytics</h2>
                <ToggleButtonGroup
                  value={analyticsRange}
                  exclusive
                  onChange={(_, newRange) => newRange && setAnalyticsRange(newRange)}
                  size="small"
                  color="primary"
                  sx={{ background: '#f6f3ea', borderRadius: 2 }}
                >
                  <ToggleButton value="day">Day</ToggleButton>
                  <ToggleButton value="month">Month</ToggleButton>
                  <ToggleButton value="year">Year</ToggleButton>
                </ToggleButtonGroup>
              </div>
              <LineChart
                height={300}
                series={[{ data: analyticsData[analyticsRange].data, label: 'Sales', color: '#bfa76a' }]}
                xAxis={[{ scaleType: 'point', data: analyticsData[analyticsRange].labels }]}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                  '.MuiLineElement-root': { strokeWidth: 3 },
                  '.MuiMarkElement-root': { stroke: '#bfa76a', fill: '#fff', strokeWidth: 2 },
                  '.MuiChartsAxis-tickLabel': { fontWeight: 500 },
                }}
              />
            </div>
          </div>
        )}
        {activeSection === "Products" && <ProductsSection />}
        {activeSection === "Orders" && <OrdersSection />}
        {activeSection === "Earnings" && <EarningsSection />}
        {activeSection === "Profile" && <ProfileSection />}
      </section>
    </main>
  );
}
