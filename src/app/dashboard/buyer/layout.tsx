import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-white to-[#fffbe6] p-6 border-r-2 border-[#d4b572] flex flex-col gap-6 shadow-xl rounded-tr-3xl rounded-br-3xl">
  <div className="flex items-center gap-3 mb-8">
    <span className="text-3xl text-[#d4b572]">🌟</span>
    <h2 className="text-2xl font-extrabold text-[#d4b572] tracking-tight">Buyer</h2>
  </div>
  <div className="uppercase text-xs text-gray-400 font-bold mb-2 px-2 tracking-widest">Navigation</div>
        <h2 className="text-2xl font-extrabold mb-8 focus:text-[#d4b572]">Buyer</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/buyer">
            <span className="text-left px-3 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 block font-extrabold text-[#d4b572] shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]">Dashboard</span>
          </Link>
          <Link href="/dashboard/buyer/profile">
            <span className="text-left px-3 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 block font-extrabold text-[#d4b572] shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]">Profile</span>
          </Link>
          <Link href="/dashboard/buyer/orders">
            <span className="text-left px-3 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 block font-extrabold text-[#d4b572] shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]">Orders</span>
          </Link>
          <Link href="/dashboard/buyer/wishlist">
            <span className="text-left px-3 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 block font-extrabold text-[#d4b572] shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]">Wishlist</span>
          </Link>
          <Link href="/dashboard/buyer/address">
            <span className="text-left px-3 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 block font-extrabold text-[#d4b572] shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]">Address</span>
          </Link>
          <Link href="/dashboard/buyer/payment-method">
            <span className="text-left px-3 py-2 rounded-lg hover:bg-[#fff7e0] hover:scale-[1.04] transition-all duration-150 block font-extrabold text-[#d4b572] shadow-gold-sm border-l-4 border-transparent hover:border-[#d4b572] focus:border-[#d4b572]">Payment Method</span>
          </Link>
        </nav>
      </aside>
      <main className="p-6 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
