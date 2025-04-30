"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// Using SVG directly instead of react-icons to avoid dependency issues
import CartController from "../controllers/cartController";
import AuthController from "../controllers/authController";

// Define cart item type
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export default function Navbar() {
  const { user, roles, clearAuth } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart items using CartController
  useEffect(() => {
    // Load cart items initially
    setCartItems(CartController.getItems());
    
    // Listen for cart updates from other components
    const handleCartUpdate = (event: any) => {
      if (event.detail && event.detail.cartItems) {
        setCartItems(event.detail.cartItems);
      }
    };
    
    // Set up event listener
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Set up storage event listener to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems' && e.newValue) {
        setCartItems(CartController.getItems());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`group sticky top-0 z-50 w-full transition-shadow bg-white shadow-md border-b ${scrolled ? "shadow-md border-gray-200" : "border-transparent"} hover:bg-white/60 hover:backdrop-blur-lg hover:border-white/30 hover:shadow-lg transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-6 py-2 md:py-3">
        {/* Logo - now clickable to landing page */}
        <a href="/" className="flex items-center gap-3 min-h-[48px] cursor-pointer">
          <img src="/RupaRawi.png" alt="Rupa Rawi" className="h-10 w-auto object-contain" style={{fontFamily: '"Homemade Apple", cursive'}} />
          <span className="text-black text-xl font-semibold tracking-wide league-script-regular">Rupa Rawi</span>
        </a>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button className="p-1 rounded hover:bg-gray-100 transition" aria-label="Search">
            <svg width="22" height="22" fill="none" stroke="black" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
          <Link href="/cart" className="relative group p-1 hover:bg-gray-100 rounded transition" aria-label="Cart">
            <svg width="22" height="22" fill="none" stroke="black" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /><path d="M3 4h2l.4 2M7 13h10l4-8H5.4" /></svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4b572] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
          {/* User Avatar and Username */}
          {user && (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                onClick={() => setShowUserMenu((v) => !v)}
                aria-label="User menu"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <span className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg uppercase">
                    {user.username ? user.username[0].toUpperCase() : '?'}
                  </span>
                )}
                <span className="hidden sm:inline font-semibold text-gray-800 max-w-[100px] truncate">{user.username}</span>
                <svg className="ml-1 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in py-2">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <span className="block text-xs text-gray-500 mb-1">Roles</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${Array.isArray(roles) && roles.includes('admin') ? 'bg-red-100 text-red-700' : Array.isArray(roles) && roles.includes('vendor') ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{Array.isArray(roles) && roles.length > 0 ? roles.join(', ') : 'buyer'}</span>
                  </div>
                  {roles.includes('admin') && (
                    <Link
                      href="/dashboard/admin"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {roles.includes('vendor') && (
                    <Link
                      href="/dashboard/vendor"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Vendor Dashboard
                    </Link>
                  )}
                  {(roles.includes('buyer') || roles.length === 0) && (
                    <Link
                      href="/dashboard/user"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      User Dashboard
                    </Link>
                  )}
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-b"
                    onClick={() => {
                      clearAuth();
                      setShowUserMenu(false);
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Hamburger menu (always visible, after cart icon) */}
          <button
            className="ml-2 p-1 rounded hover:bg-gray-100 transition"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="28" height="28" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
      {/* Overlay Menu (shows on all screen sizes) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex justify-end animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false);
          }}
        >
          <div
            className="bg-white w-full max-w-md min-h-screen h-full shadow-2xl border-l-2 border-gray-200 p-8 flex flex-col gap-8 relative animate-slide-in-right"
            role="dialog"
            aria-modal="true"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Close button inside the menu */}
            <button
              className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 transition"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="28" height="28" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" /></svg>
            </button>
            <h2 className="text-lg font-bold mb-4 text-black">MENU</h2>
            <nav className="flex flex-col gap-4">
              {[{ label: "About", href: "/about" }, { label: "Login", href: "/login" }].map(({ label, href }, idx) => (
                <a
                  key={label + '-' + idx}
                  href={href}
                  className="block text-base font-medium text-black hover:text-black transition-colors py-2 underline-offset-4 hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-auto text-gray-500">Copyright 2025 Rupa Rawi</div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.35s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

    </nav>
  );
}


