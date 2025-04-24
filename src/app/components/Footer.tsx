"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 text-gray-700 py-10 px-4 mt-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8 items-center md:items-start">
        {/* Brand and description */}
        <div className="flex flex-col items-center md:items-start">
          <div className="font-serif font-bold text-2xl text-gray-900 mb-2">Rupa Rawi</div>
          <div className="mb-4 text-gray-600">Wujud yang membawa cerita</div>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Instagram" className="hover:text-black"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
            <a href="#" aria-label="Facebook" className="hover:text-black"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 8h-2a2 2 0 0 0-2 2v2h4l-.5 4h-3.5v4" /></svg></a>
            <a href="#" aria-label="Twitter" className="hover:text-black"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M8 19c8.5 0 13-7 13-13v-.6A9.3 9.3 0 0 0 22 3.5a9.2 9.2 0 0 1-2.6.7A4.5 4.5 0 0 0 21.5 2a9.1 9.1 0 0 1-2.9 1.1A4.5 4.5 0 0 0 12 6.5a12.8 12.8 0 0 1-9.3-4.7S2 7 6 9a4.5 4.5 0 0 1-2-2.5c0 .2 0 .3.1.5A4.5 4.5 0 0 0 8 13.5a9.2 9.2 0 0 1-5.7 2" /></svg></a>
          </div>
        </div>
        {/* Links */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <a href="#family" className="hover:underline">Koleksi Keluarga</a>
          <a href="#women" className="hover:underline">Kebaya</a>
          <a href="#about" className="hover:underline">Tentang</a>
          <a href="#journal" className="hover:underline">Artikel</a>
          <a href="#cart" className="hover:underline">Keranjang</a>
        </div>
        {/* Copyright */}
        <div className="text-sm text-gray-400 text-center md:text-right mt-6 md:mt-0">
          &copy; {new Date().getFullYear()} Rupa Rawi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
