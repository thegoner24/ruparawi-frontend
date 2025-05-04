import React from "react";
import Link from "next/link";

import { FaTachometerAlt, FaTags, FaStore, FaGift } from "react-icons/fa";

const vendorNav = [
  { section: "Welcome!", items: [
    { label: "Overview", href: "/dashboard/vendor", icon: <FaTachometerAlt /> },
    { label: "Business Profile", href: "/dashboard/vendor/profile", icon: <FaTags /> },
    { label: "Recent Orders", href: "/dashboard/vendor/recent-orders", icon: <FaStore /> },
    { label: "Products", href: "/dashboard/vendor/products", icon: <FaGift /> },
  ]},
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-gradient-to-b from-yellow-50 to-white border-r p-6 flex flex-col gap-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <FaTachometerAlt className="text-yellow-600 font-bold text-3xl" />
          <h2 className="text-2xl font-extrabold text-yellow-600 font-bold tracking-tight">Vendor Dashboard</h2>
        </div>
        <nav className="flex flex-col gap-6">
          {vendorNav.map((section) => (
            <div key={section.section}>
              <div className="uppercase text-xs text-gray-400 font-bold mb-2 px-2 tracking-widest">{section.section}</div>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-yellow-100 text-yellow-700 font-bold font-medium transition-colors"
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
