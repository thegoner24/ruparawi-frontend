"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts } from "../api/products";

interface Product {
  id?: number;
  name: string;
  price: number | string;
  image_url?: string;
  imageUrl?: string; // for compatibility
}

function renderProductCard(product: Product, idx: number) {
  if (product.id) {
    return (
      <Link key={product.id} href={`/shop/${product.id}`} className="flex flex-col items-stretch px-0 py-0 text-left min-h-[420px] hover:shadow-lg transition-shadow">
        <div className="w-full aspect-[4/5] flex items-end justify-center overflow-hidden bg-white group">
          {(product.image_url || product.imageUrl) ? (
            <img src={product.image_url || product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
          )}
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-lg text-black mb-2">{product.name}</div>
          <div className="text-gray-700 text-base font-normal">{product.price}</div>
        </div>
      </Link>
    );
  } else {
    return (
      <div key={idx} className="flex flex-col items-stretch px-0 py-0 text-left min-h-[420px]">
        <div className="w-full aspect-[4/5] flex items-end justify-center overflow-hidden bg-white group">
          {(product.image_url || product.imageUrl) ? (
            <img src={product.image_url || product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
          )}
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-lg text-black mb-2">{product.name}</div>
          <div className="text-gray-700 text-base font-normal">{product.price}</div>
        </div>
      </div>
    );
  }
}

export default function ProductContainer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        // Support both { products: [...] } and array response
        let items: any[] = Array.isArray(data) ? data : data.products || [];
        setProducts(items);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Split products into rows like before
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
              <h2 className="text-3xl font-light mb-6 text-center text-black">For Family<br />Moments<br />That Matter</h2>
              <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop Now</a>
            </div>
            {/* Product cards row 1 */}
            {row1.map((product, idx) => renderProductCard(product, idx))}
          </div>
          {/* Second row: 4 products, no left text */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
            {row2.map((product, idx) => renderProductCard(product, idx))}
          </div>
          {/* Third row: 3 products + right column with button */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
            {/* Product cards row 3 */}
            {row3.map((product, idx) => renderProductCard(product, idx))}
            {/* Right column with button */}
            <div className="flex flex-col items-center justify-center px-8 py-8">
              <a href="/shop" className="bg-black text-white rounded-full px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition">VIEW ALL PRODUCTS</a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

