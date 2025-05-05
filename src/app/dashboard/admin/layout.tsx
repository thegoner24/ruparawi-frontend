import React from "react";
import Link from "next/link";

import { FaTachometerAlt, FaTags, FaStore, FaGift, FaBook } from "react-icons/fa";

const adminNav = [
  { section: "Welcome!", items: [
    { label: "Overview", href: "/dashboard/admin", icon: <FaTachometerAlt /> },
    { label: "Categories", href: "/dashboard/admin/categories", icon: <FaTags /> },
    { label: "Vendors", href: "/dashboard/admin/vendors", icon: <FaStore /> },
    { label: "Promotions", href: "/dashboard/admin/promotions", icon: <FaGift /> },
    { label: "Articles", href: "/dashboard/admin/articles", icon: <FaBook /> },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-gradient-to-b from-pink-50 to-white border-r p-6 flex flex-col gap-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <FaTachometerAlt className="text-pink-600 text-3xl" />
          <h2 className="text-2xl font-extrabold text-pink-600 tracking-tight">Admin Dashboard</h2>
        </div>
        <nav className="flex flex-col gap-6">
          {adminNav.map((section) => (
            <div key={section.section}>
              <div className="uppercase text-xs text-gray-400 font-bold mb-2 px-2 tracking-widest">{section.section}</div>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pink-100 text-pink-700 font-medium transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
