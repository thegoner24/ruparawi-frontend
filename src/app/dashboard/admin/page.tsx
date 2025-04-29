"use client";
import React, { useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const sidebarLinks = [
  { label: "Overview" },
  { label: "Vendor Management" },
  { label: "Articles" },
  { label: "Settings" },
  { label: "Profile" },
];

// We'll use a simple textarea instead of Lexical for now

// Custom notification component
function Notification({ type, message, onClose }: { type: 'success' | 'error', message: string, onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center justify-between max-w-sm`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
        &times;
      </button>
    </div>
  );
}

// Simple rich text editor component (using textarea for now)
function RichTextEditor({ value, onChange }: { value: string, onChange: (content: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#bfa76a]"
      placeholder="Write your article here..."
    />
  );
}

function NewArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setNotification({ type: 'success', message: 'Article published!' });
        setTitle("");
        setContent("");
        setImage(null);
        setImagePreview(null);
      } else {
        setNotification({ type: 'error', message: 'Failed to publish article.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Network or server error.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]"
            placeholder="Article Title"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-200 rounded px-3 py-2"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded border" />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-[#bfa76a] text-white rounded-full font-semibold shadow hover:bg-[#a28d4f] transition self-start disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}

// Vendor Management Component
function VendorManagement() {
  const [vendorTab, setVendorTab] = useState("Active Vendors");
  
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-6">
          {["Active Vendors", "Vendor Requests"].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setVendorTab(tab)}
              className={`pb-3 px-1 ${vendorTab === tab ? 'border-b-2 border-[#bfa76a] text-[#bfa76a] font-semibold' : 'text-gray-500 hover:text-[#bfa76a]'}`}
            >
              {tab}
              {tab === "Vendor Requests" && (
                <span className="ml-2 bg-[#bfa76a] text-white text-xs rounded-full px-2 py-0.5">3</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Vendors Tab */}
      <div className={vendorTab === "Active Vendors" ? "block" : "hidden"}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input type="text" placeholder="Search vendors..." className="border border-gray-200 rounded px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" />
          <select className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f6f3ea] text-[#bfa76a]">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Vendor One", email: "vendor1@example.com", status: "Active" },
                { name: "Vendor Two", email: "vendor2@example.com", status: "Rejected" },
                { name: "Vendor Three", email: "vendor3@example.com", status: "Pending" },
              ].map((vendor, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{vendor.name}</td>
                  <td className="px-4 py-2">{vendor.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${vendor.status === 'Active' ? 'bg-green-100 text-green-700' : vendor.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{vendor.status}</span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="px-3 py-1 bg-[#bfa76a] text-white rounded shadow hover:bg-[#a28d4f] transition">View</button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded shadow hover:bg-yellow-200 transition">Suspend</button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Requests Tab */}
      <div className={vendorTab === "Vendor Requests" ? "block" : "hidden"}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-lg font-medium">Pending Vendor Applications</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded shadow hover:bg-green-200 transition text-sm font-medium">Approve All</button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition text-sm font-medium">Reject All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f6f3ea] text-[#bfa76a]">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Business Type</th>
                <th className="px-4 py-2 text-left">Date Applied</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "New Vendor 1", email: "newvendor1@example.com", businessType: "Retail", dateApplied: "2025-04-25" },
                { name: "New Vendor 2", email: "newvendor2@example.com", businessType: "Wholesale", dateApplied: "2025-04-26" },
                { name: "New Vendor 3", email: "newvendor3@example.com", businessType: "Manufacturing", dateApplied: "2025-04-28" },
              ].map((request, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{request.name}</td>
                  <td className="px-4 py-2">{request.email}</td>
                  <td className="px-4 py-2">{request.businessType}</td>
                  <td className="px-4 py-2">{request.dateApplied}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="px-3 py-1 bg-[#bfa76a] text-white rounded shadow hover:bg-[#a28d4f] transition">View Details</button>
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded shadow hover:bg-green-200 transition">Approve</button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  // Analytics chart data by range
  const [analyticsRange, setAnalyticsRange] = useState<'day' | 'month' | 'year'>('day');
  const analyticsData = {
    day: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [10, 24, 12, 18, 30, 22, 28],
    },
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [120, 150, 110, 170, 210, 195, 230, 180, 220, 250, 240, 260],
    },
    year: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      data: [1200, 1350, 1280, 1420, 1550],
    },
  };
  useEffect(() => {
    setTimeout(() => {
      setUsername("Admin"); // Replace with real admin username from API
    }, 500);
  }, []);

  return (
    <main className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-white border border-gray-200 rounded-full p-2 shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6 text-[#bfa76a]"><rect x="3" y="6" width="14" height="2" rx="1" fill="currentColor"/><rect x="3" y="12" width="14" height="2" rx="1" fill="currentColor"/></svg>
      </button>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col p-6">
            <button
              className="absolute top-4 right-4"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6 text-[#bfa76a]"><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="flex flex-col items-center mt-2 mb-6">
              <img
                src="https://www.gravatar.com/avatar/?d=mp&s=96"
                alt="Admin Avatar"
                className="w-12 h-12 rounded-full border-2 border-[#bfa76a] bg-gray-100 object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#bfa76a] mb-8 tracking-tight">{username ? `${username}'s Admin` : 'Admin Dashboard'}</h2>
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
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} style={{ background: 'rgba(0,0,0,0.3)' }} />
        </div>
      )}
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
        <div className="flex flex-col items-center mt-2 mb-6">
          <img
            src="https://www.gravatar.com/avatar/?d=mp&s=96"
            alt="Admin Avatar"
            className="w-12 h-12 rounded-full border-2 border-[#bfa76a] bg-gray-100 object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-[#bfa76a] mb-8 tracking-tight text-center">{username ? `${username}'s Admin` : 'Admin Dashboard'}</h2>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <button
              key={link.label}
              onClick={() => setActiveSection(link.label)}
              className={`px-4 py-2 rounded-md text-left text-gray-700 font-medium transition ${activeSection === link.label ? 'bg-[#f6f3ea] text-[#bfa76a]' : 'hover:bg-[#f6f3ea] hover:text-[#bfa76a]'}`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Main Content */}
      <section className="flex-1 flex flex-col p-6">
        {activeSection === "Overview" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-gray-500 text-sm mb-2">Total Vendors</span>
                <span className="text-2xl font-bold text-[#bfa76a]">320</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
                <span className="text-gray-500 text-sm mb-2">Revenue</span>
                <span className="text-2xl font-bold text-[#bfa76a]">$245,000</span>
              </div>
            </div>
            {/* Vendor List Preview */}
            <div className="bg-white rounded-xl p-6 shadow mt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Recent Vendors</h2>
                  <p className="text-sm text-gray-500">Overview of your platform vendors</p>
                </div>
                <div className="flex items-center gap-3">
                  <select className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bfa76a]">
                    <option value="all">All Vendors</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="new">New (Last 7 days)</option>
                  </select>
                  <button 
                    onClick={() => setActiveSection("Vendor Management")} 
                    className="text-sm text-[#bfa76a] hover:underline font-medium flex items-center"
                  >
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-[#f6f3ea] text-[#bfa76a]">
                      <th className="px-4 py-2 text-left">Vendor</th>
                      <th className="px-4 py-2 text-left">Joined</th>
                      <th className="px-4 py-2 text-left">Products</th>
                      <th className="px-4 py-2 text-left">Revenue</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { 
                        name: "Vendor One", 
                        email: "vendor1@example.com", 
                        status: "Active", 
                        joinedDate: "2025-04-15",
                        isNew: false,
                        products: 24,
                        revenue: "$12,450",
                        avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                      },
                      { 
                        name: "Vendor Two", 
                        email: "vendor2@example.com", 
                        status: "Rejected", 
                        joinedDate: "2025-04-18",
                        isNew: false,
                        products: 8,
                        revenue: "$3,240",
                        avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?s=200"
                      },
                      { 
                        name: "Vendor Three", 
                        email: "vendor3@example.com", 
                        status: "Pending", 
                        joinedDate: "2025-04-27",
                        isNew: true,
                        products: 5,
                        revenue: "$1,120",
                        avatar: "https://www.gravatar.com/avatar/6a6c19fea4a3676970167ce51f39e6ee?s=200"
                      },
                    ].map((vendor, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={vendor.avatar} 
                              alt={vendor.name} 
                              className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                            />
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-xs text-gray-500">{vendor.email}</div>
                            </div>
                            {vendor.isNew && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">New</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{vendor.joinedDate}</td>
                        <td className="px-4 py-3">{vendor.products}</td>
                        <td className="px-4 py-3 font-medium">{vendor.revenue}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${vendor.status === 'Active' ? 'bg-green-100 text-green-700' : vendor.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{vendor.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-[#bfa76a] text-white rounded shadow hover:bg-[#a28d4f] transition text-xs">View</button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded shadow hover:bg-gray-200 transition text-xs">Message</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <p>Showing 3 of 24 vendors</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs">Previous</button>
                  <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeSection === "Vendor Management" && <VendorManagement />}
        {activeSection === "Articles" && (
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Articles</h2>
              <button className="px-4 py-2 bg-[#bfa76a] text-white rounded shadow hover:bg-[#a28d4f] transition self-start md:self-auto">New Article</button>
            </div>
            {/* Article List */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#f6f3ea] text-[#bfa76a]">
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: "Welcome to the Platform", status: "Published", date: "2025-04-01" },
                    { title: "Vendor Tips & Tricks", status: "Draft", date: "2025-04-15" },
                  ].map((article, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{article.title}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${article.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{article.status}</span>
                      </td>
                      <td className="px-4 py-2">{article.date}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="px-3 py-1 bg-[#bfa76a] text-white rounded shadow hover:bg-[#a28d4f] transition">Edit</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded shadow hover:bg-red-200 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* New Article Form */}
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold mb-2">Publish New Article</h3>
              <NewArticleForm />
            </div>
          </div>
        )}
        {activeSection === "Settings" && (
          <div className="bg-white rounded-xl p-6 shadow max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
            <form className="flex flex-col gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Platform Name</label>
                <input type="text" className="w-full border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" placeholder="RevoBank" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Support Email</label>
                <input type="email" className="w-full border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" placeholder="support@revobank.com" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="vendor-signup" className="rounded border-gray-300 focus:ring-[#bfa76a]" />
                <label htmlFor="vendor-signup" className="text-gray-700">Enable vendor signup</label>
              </div>
              <button type="submit" className="px-5 py-2 bg-[#bfa76a] text-white rounded-full font-semibold shadow hover:bg-[#a28d4f] transition self-start">Save Settings</button>
            </form>
          </div>
        )}
        {activeSection === "Profile" && (
          <div className="bg-white rounded-xl p-6 shadow max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
            <form className="flex flex-col gap-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 text-xl">👤</span>
                  </div>
                  <button type="button" className="px-3 py-1 bg-[#bfa76a] text-white rounded font-medium shadow hover:bg-[#a28d4f] transition">Change Photo</button>
                  <input type="file" className="hidden" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="admin-name">Name</label>
                <input id="admin-name" type="text" className="w-full border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" placeholder="Admin Name" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="admin-email">Email</label>
                <input id="admin-email" type="email" className="w-full border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" placeholder="admin@email.com" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="admin-password">Change Password</label>
                <input id="admin-password" type="password" className="w-full border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" placeholder="New Password" />
              </div>
              <button type="submit" className="px-5 py-2 bg-[#bfa76a] text-white rounded-full font-semibold shadow hover:bg-[#a28d4f] transition self-start">Save Changes</button>
            </form>
            {/* Danger Zone */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-red-700 font-semibold mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-500 mb-4">Delete this admin account. This action cannot be undone.</p>
              <button className="px-5 py-2 bg-red-100 text-red-700 rounded-full font-semibold shadow hover:bg-red-200 transition">Delete Account</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
