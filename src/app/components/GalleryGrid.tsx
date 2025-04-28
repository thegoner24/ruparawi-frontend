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
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH0339-1.jpg?v=1741597213&width=1080',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" "Nokta Hitam" Kebaya Panjang',
    price: '2.100.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH0504-1.jpg?v=1741588038&width=1080',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" "Nokta Hitam" Kebaya Hitam',
    price: '2.100.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH1064-1.jpg?v=1741591090&width=1080',
  },
  // Second row
  {
    name: '"Nitik Cerah" - Kebaya Panjang',
    price: '2.100.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH1024-1.jpg?v=1741588890&width=1080',
  },
  {
    name: 'Gold Kebaya',
    price: '2.100.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/kama2.jpg?v=1737357926&width=1080',
  },
  {
    name: 'Maroon Kebaya',
    price: '2.100.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/kama1.jpg?v=1737357952&width=1080',
  },
];

export default function GalleryGrid() {
  return (
    <section className="w-full bg-white">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Left text column */}
        <div className="flex flex-col items-center justify-center px-8 py-12 md:col-span-1 border-r border-gray-200">
          <h2 className="text-3xl font-light mb-6 text-center text-black">Celebrate The Women Who Shape Our World</h2>
          <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop now</a>
        </div>
        {/* Product cards */}
        {galleryProducts.map((product, idx) => (
          <div key={idx} className="flex flex-col items-stretch px-0 py-0 text-left min-h-[420px]">
            <div className="w-full aspect-[4/5] flex items-end justify-center overflow-hidden bg-white group">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="px-6 py-4">
              <div className="font-bold text-lg text-black mb-2">{product.name}</div>
              <div className="text-gray-700 text-base font-normal">{product.price}</div>
            </div>
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
