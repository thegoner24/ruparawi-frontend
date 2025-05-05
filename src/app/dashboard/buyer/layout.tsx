import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f6f3ea] p-6 border-r border-[#e8d8b9] flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-8 text-[#bfa76a]">Buyer</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/buyer">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Dashboard</span>
          </Link>
          <Link href="/dashboard/buyer/orders">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Orders</span>
          </Link>
          <Link href="/dashboard/buyer/wishlist">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Wishlist</span>
          </Link>
          <Link href="/dashboard/buyer/address">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Address</span>
          </Link>
          <Link href="  /dashboard/buyer/profile">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Profile</span>
          </Link>
          <Link href="/dashboard/buyer/payment-method">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Payment Method</span>
          </Link>
          <Link href="/dashboard/buyer/notifications">
            <span className="text-left px-3 py-2 rounded hover:bg-[#f0e9d6] block">Notifications</span>
          </Link>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Buyer Dashboard</h1>
        {children}
      </main>
    </div>
  );
}
