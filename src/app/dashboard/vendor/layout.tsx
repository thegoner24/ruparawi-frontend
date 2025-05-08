import React from "react";
import Link from "next/link";

import { FaTachometerAlt, FaTags, FaStore, FaGift } from "react-icons/fa";

const vendorNav = [
  { section: "Welcome!", items: [
    { label: "Overview", href: "/dashboard/vendor", icon: <FaTachometerAlt className="text-[#d4b572]" /> },
    { label: "Business Profile", href: "/dashboard/vendor/profile", icon: <FaTags className="text-[#d4b572]" /> },
    { label: "Recent Orders", href: "/dashboard/vendor/recent-orders", icon: <FaStore className="text-[#d4b572]" /> },
    { label: "Products", href: "/dashboard/vendor/products", icon: <FaGift className="text-[#d4b572]" /> },
  ]},
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-gradient-to-b from-white to-[#fffbe6] p-6 border-r-2 border-[#d4b572] flex flex-col gap-6 shadow-xl rounded-tr-3xl rounded-br-3xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl text-[#d4b572]">🏪</span>
          <h2 className="text-2xl font-extrabold text-[#d4b572] tracking-tight">Vendor</h2>
        </div>
        <div className="uppercase text-xs text-gray-400 font-bold mb-2 px-2 tracking-widest">Navigation</div>
        <div className="flex items-center gap-3 mb-6">
          <FaTachometerAlt className="text-[#d4b572] text-3xl" />
          <h2 className="text-2xl font-extrabold text-[#d4b572] tracking-tight">Vendor Dashboard</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {vendorNav.map((section) => (
            <div key={section.section}>
              <div className="uppercase text-xs text-gray-400 font-bold mb-2 px-2 tracking-widest">{section.section}</div>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                  >
                    <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#f9eecb] transition">
                      {item.icon}
                      <span className="font-semibold text-[#bfa14e]">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="p-6 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
