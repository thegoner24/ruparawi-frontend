import React from "react";

interface GalleryProduct {
  name: string;
  price: string;
  subtitle?: string;
  imageUrl: string;
}

const galleryProducts: GalleryProduct[] = [
  // First row (skip first cell for text block)
  {
    name: '"Nitik Cerah" - Kebaya Panjang',
    price: '2.100.000,00',
    imageUrl: '/gallery1.png',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" "Nokta Hitam" Kebaya Panjang',
    price: '2.100.000,00',
    imageUrl: '/gallery2.png',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" "Nokta Hitam" Kebaya Hitam',
    price: '2.100.000,00',
    imageUrl: '/gallery3.png',
  },
  // Second row
  {
    name: '"Nitik Cerah" - Kebaya Panjang',
    price: '2.100.000,00',
    imageUrl: '/gallery4.png',
  },
  {
    name: 'Gold Kebaya',
    price: '2.100.000,00',
    imageUrl: '/gallery5.png',
  },
  {
    name: 'Maroon Kebaya',
    price: '2.100.000,00',
    imageUrl: '/gallery6.png',
  },
];

export default function GalleryGrid() {
  return (
    <section className="w-full bg-white py-12">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Left text column */}
        <div className="flex flex-col items-center justify-center px-8 py-12 md:col-span-1 border-r border-gray-200">
          <h2 className="text-3xl font-light mb-6 text-center text-black">Celebrate The Women Who Shape Our World</h2>
          <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop now</a>
        </div>
        {/* Product cards */}
        {galleryProducts.map((product, idx) => (
          <div key={idx} className="flex flex-col items-center px-6 py-8 text-left">
            <img src={product.imageUrl} alt={product.name} className="h-72 object-contain mb-6" />
            <div className="font-bold text-lg text-black mb-2">{product.name}</div>
            <div className="text-gray-700 text-base font-normal">{product.price}</div>
          </div>
        ))}
        {/* View All Products button as last card */}
        <div className="flex flex-col items-center justify-center px-8 py-8">
          <a href="#" className="bg-black text-white rounded-full px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition">VIEW ALL PRODUCTS</a>
        </div>
      </div>
    </section>
  );
}
