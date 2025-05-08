"use client";
import React from "react";
import { fetchPublicVendorProducts } from "@/app/api/publicVendorProducts";

export default function GalleryGrid() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPublicVendorProducts("enclosure");
        setProducts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Left text column */}
        <div className="flex flex-col items-center justify-center px-8 py-12 md:col-span-1 border-r border-gray-200">
          <h2 className="text-3xl font-light mb-6 text-center text-black">Celebrate The Women Who Shape Our World</h2>
          <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop now</a>
        </div>
        {/* Product cards */}
        {loading ? (
          <div className="col-span-3 flex items-center justify-center min-h-[420px] text-gray-400 text-lg">Loading products...</div>
        ) : error ? (
          <div className="col-span-3 flex items-center justify-center min-h-[420px] text-red-400 text-lg">{error}</div>
        ) : products.length === 0 ? (
          <div className="col-span-3 flex items-center justify-center min-h-[420px] text-gray-400 text-lg">No products found.</div>
        ) : (
          products.slice(0, 6).map((product: any, idx: number) => (
            <div key={product.id || idx} className="flex flex-col items-stretch px-0 py-0 text-left min-h-[420px]">
              <div className="w-full aspect-[4/5] flex items-end justify-center overflow-hidden bg-white group">
                <img src={product.image_url || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-lg text-black mb-2">{product.name}</div>
                <div className="text-gray-700 text-base font-normal">{product.price ? `Rp ${product.price.toLocaleString()}` : '-'}</div>
              </div>
            </div>
          ))
        )}
        {/* View All Products button as last card */}
        <div className="flex flex-col items-center justify-center px-8 py-8">
          <a href="#" className="bg-black text-white rounded-full px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition">VIEW ALL PRODUCTS</a>
        </div>
      </div>
    </section>
  );
}
