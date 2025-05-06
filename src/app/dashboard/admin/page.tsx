import React from "react";

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[#d4b572]">Admin Overview</h1>
      <div className="bg-white rounded-xl shadow-lg border border-[#f5e6b2] p-6 mb-8">
        <p className="text-gray-700">Welcome to the Admin Dashboard. Use the sidebar to manage users, orders, products, notifications, and your profile.</p>
      </div>
      {/* Sneak Peek Summary Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-[#f5e6b2]">
          <thead>
            <tr className="bg-[#fffbe6]">
              <th className="p-4 text-left font-bold text-[#d4b572]">Section</th>
              <th className="p-4 text-left font-bold text-[#d4b572]">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-[#fff7e0] transition">
              <td className="flex items-center gap-3 p-4">
                <span className="text-2xl text-[#d4b572]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3V7H4a1 1 0 00-1 1zM17 7v4a1 1 0 001 1h3V7h-3a1 1 0 00-1 1zM3 17v4a1 1 0 001 1h3v-6H4a1 1 0 00-1 1zM17 17v4a1 1 0 001 1h3v-6h-3a1 1 0 00-1 1z" /></svg></span>
                <a href="/dashboard/admin/categories" className="font-extrabold text-lg text-[#b49a4d] underline shadow-gold-sm hover:text-[#d4b572] focus:text-[#d4b572]">Categories</a>
              </td>
              <td className="p-4 text-gray-600">Organize and manage product categories and subcategories.</td>
            </tr>
            <tr className="border-b hover:bg-[#fff7e0] transition">
              <td className="flex items-center gap-3 p-4">
                <span className="text-2xl text-[#d4b572]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg></span>
                <a href="/dashboard/admin/vendors" className="font-extrabold text-lg text-[#b49a4d] underline shadow-gold-sm hover:text-[#d4b572] focus:text-[#d4b572]">Vendors</a>
              </td>
              <td className="p-4 text-gray-600">Review and manage vendor applications and profiles.</td>
            </tr>
            <tr className="border-b hover:bg-[#fff7e0] transition">
              <td className="flex items-center gap-3 p-4">
                <span className="text-2xl text-[#d4b572]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m0 0l-6 6m6-6v12" /></svg></span>
                <a href="/dashboard/admin/promotions" className="font-extrabold text-lg text-[#b49a4d] underline shadow-gold-sm hover:text-[#d4b572] focus:text-[#d4b572]">Promotions</a>
              </td>
              <td className="p-4 text-gray-600">Create, edit, and manage promotional campaigns and discounts.</td>
            </tr>
            <tr className="hover:bg-[#fff7e0] transition">
              <td className="flex items-center gap-3 p-4">
                <span className="text-2xl text-[#d4b572]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg></span>
                <a href="/dashboard/admin/articles" className="font-extrabold text-lg text-[#b49a4d] underline shadow-gold-sm hover:text-[#d4b572] focus:text-[#d4b572]">Articles</a>
              </td>
              <td className="p-4 text-gray-600">Publish, edit, and manage articles for your platform.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
