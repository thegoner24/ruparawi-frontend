"use client";
import { useEffect, useState } from "react";
import { fetchPublicVendorProducts } from "@/app/api/publicVendorProducts";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // You can change this business name as needed
        const data = await fetchPublicVendorProducts("Enclosure");
        console.log("[VendorProductsPage] API returned:", data);
        setProducts(Array.isArray(data) ? data : []);
        // Log what is being set in products
        setTimeout(() => {
          console.log("[VendorProductsPage] products state:", data);
        }, 0);
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
    <main className="w-full bg-white min-h-screen">
      {/* Banner */}
      <div className="w-full h-[500px] md:h-80 lg:h-[500px] flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-[#f8f5f0] to-[#ede9dd] mb-8">
        <img src="https://static.vecteezy.com/system/resources/thumbnails/008/406/587/small/batik-parang-seamless-pattern-background-black-w-vector.jpg" alt="Vendor Banner" className="w-full h-full object-cover object-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <h1 className="absolute left-8 bottom-8 text-white text-3xl md:text-5xl font-bold drop-shadow-lg tracking-tight">Vendor Products</h1>
      </div>
      {/* 3-column story section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0 mb-12">
        {/* Left: Heading and Batik Parang meta */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <h2 className="text-2xl font-semibold mb-4 text-[#bfa76a]">Batik Parang Heritage</h2>
          <div className="text-gray-700 text-sm mb-2">Origin<br/><span className="font-medium">Java, Indonesia</span></div>
          <div className="text-gray-700 text-sm mb-2">Motif<br/><span className="font-medium">Parang</span></div>
          <div className="text-gray-700 text-sm">Symbolism<br/><span className="font-medium">Strength & Continuity</span></div>
        </div>
        {/* Center & Right: Batik Parang Story */}
        <div className="col-span-2 text-gray-700 text-base leading-relaxed flex flex-col gap-4">
          <p>Our journey is woven into the timeless waves of Batik Parang, one of Indonesia’s oldest and most revered motifs. Inspired by the rolling waves of the ocean and the enduring spirit of the parang (machete), this pattern symbolizes resilience, courage, and the unbroken flow of life.</p>
          <p>Each piece we create is crafted by skilled artisans who honor centuries-old traditions, using techniques passed down through generations. The diagonal lines of Batik Parang represent persistence and the strength to overcome life’s challenges, while the intricate details reflect our commitment to artistry and cultural heritage.</p>
          <p>We are dedicated to preserving the legacy of Batik Parang—sharing its beauty, meaning, and craftsmanship with the world. Thank you for joining us in celebrating this living tradition, where every product tells a story of heritage, artistry, and Indonesian pride.</p>
        </div>
      </section>
      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#bfa76a]"></div>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center py-4">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: any) => {
            // Prefer primary image, else first image, else fallback
            let displayImage = "/placeholder.png";
            if (Array.isArray(product.images) && product.images.length > 0) {
              const primary = product.images.find((img: any) => img.is_primary);
              const imgUrl = (primary ? primary.image_url : product.images[0].image_url);
              if (imgUrl && /^https?:\/\//.test(imgUrl)) {
                displayImage = imgUrl;
              }
            }
            return (
              <div
                key={product.id}
                className="relative bg-white rounded-2xl shadow-lg border border-[#e8d8b9] p-5 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden"
              >
                {/* Out of stock badge */}
                {product.stock === 0 && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">Out of Stock</span>
                )}
                {/* Product image */}
                <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden mb-4 flex items-center justify-center bg-gray-50 group-hover:ring-4 group-hover:ring-[#bfa76a]/20 transition-all">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Product info */}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold line-clamp-1 text-black mb-1 flex-1">{product.name}</h2>
                  <p className="text-[#bfa76a] font-bold text-lg mb-1">{product.price ? `Rp${product.price.toLocaleString()}` : '-'}</p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">Stock: {product.stock ?? '-'}</span>
                    <a
  href={`/shop/${product.id}`}
  className="px-4 py-1 bg-[#bfa76a] text-white rounded-full text-xs font-semibold hover:bg-[#a08e5a] shadow transition text-center focus:outline-none focus:ring-2 focus:ring-[#bfa76a]"
  tabIndex={0}
  role="button"
>
  View Details
</a>`
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
