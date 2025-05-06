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
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 text-[#d4b572] font-extrabold shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]"
                  >
                    <span className="text-lg">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-h-screen flex flex-col items-center justify-start bg-[#faf7ef] p-8">
  <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 mt-6">
    {children}
  </div>
</main>
    </div>
  );
}
