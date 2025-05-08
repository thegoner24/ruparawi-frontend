"use client";
import React from "react";
import Link from "next/link";
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
        const data = await fetchPublicVendorProducts("Enclosure");
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

  function renderProductCard(product: any, idx: number) {
    // Prefer primary image, else first image, else fallback
    let displayImage = "https://images.unsplash.com/photo-1444362408440-274ecb6fc730?q=80&w=2074&auto=format&fit=crop";
    if (Array.isArray(product.images) && product.images.length > 0) {
      const primary = product.images.find((img: any) => img.is_primary);
      const imgUrl = (primary ? primary.image_url : product.images[0].image_url);
      if (imgUrl && /^https?:\/\//.test(imgUrl)) {
        displayImage = imgUrl;
      }
    }
    const card = (
      <div className="w-full aspect-[4/5] flex items-end justify-center overflow-hidden bg-white group">
        {displayImage ? (
          <img src={displayImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
        )}
      </div>
    );
    return product.id ? (
      <Link key={product.id} href={`/shop/${product.id}`} className="flex flex-col items-stretch px-0 py-0 text-left min-h-[420px] hover:shadow-lg transition-shadow">
        {card}
        <div className="px-6 py-4">
          <div className="font-bold text-lg text-black mb-2">{product.name}</div>
          <div className="text-gray-700 text-base font-normal">{product.price ? `Rp${product.price.toLocaleString()}` : '-'}</div>
        </div>
      </Link>
    ) : (
      <div key={idx} className="flex flex-col items-stretch px-0 py-0 text-left min-h-[420px]">
        {card}
        <div className="px-6 py-4">
          <div className="font-bold text-lg text-black mb-2">{product.name}</div>
          <div className="text-gray-700 text-base font-normal">{product.price ? `Rp${product.price.toLocaleString()}` : '-'}</div>
        </div>
      </div>
    );
  }

  // Split products into rows like ProductContainer
  const row1 = products.slice(0, 3);
  const row2 = products.slice(3, 7);
  const row3 = products.slice(7, 10);

  return (
    <section className="w-full bg-white">
      {loading && (
        <div className="py-12 text-center text-gray-600">Loading products...</div>
      )}
      {error && (
        <div className="py-12 text-center text-red-500">{error}</div>
      )}
      {!loading && !error && (
        <>
          {/* First row: left text + 3 products */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
            {/* Left text column */}
            <div className="flex flex-col items-center justify-center px-8 py-12 md:col-span-1 border-r border-gray-200">
              <h2 className="text-3xl font-light mb-6 text-center text-black">Celebrate The Women Who Shape Our World</h2>
              <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop now</a>
            </div>
            {/* Product cards row 1 */}
            {row1.map((product, idx) => renderProductCard(product, idx))}
          </div>          {/* Third row: 3 products + right column with button */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
            {/* Product cards row 3 */}
            {row3.map((product, idx) => renderProductCard(product, idx))}
            {/* Right column with button */}
            <div className="flex flex-col items-center justify-center px-8 py-8">
              <a href="/vendor-products" className="bg-black text-white rounded-full px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition">VIEW ALL PRODUCTS</a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

