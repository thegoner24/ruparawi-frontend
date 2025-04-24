import React from "react";

interface Product {
  name: string;
  price: string;
  imageUrl: string;
}

const products: Product[] = [
  {
    name: '"Tenun Ombak Laut" - Baju Santai',
    price: '3.100.000,00',
    imageUrl: '/product1.png',
  },
  {
    name: '"Tenun Ombak Laut" - Long Sleeve Shirt',
    price: '3.350.000,00',
    imageUrl: '/product2.png',
  },
  {
    name: '"Bambu Onde" - Plant-based Dye Baju Panjang',
    price: '2.600.000,00',
    imageUrl: '/product3.png',
  },
];

const productsRow2: Product[] = [
  {
    name: '"Nitik Ayam" - Kids Shirt',
    price: '950.000,00',
    imageUrl: '/product4.png',
  },
  {
    name: '"Nitik Cerah" - Baju Panjang',
    price: '2.100.000,00',
    imageUrl: '/product5.png',
  },
  {
    name: '"Nitik Cerah" - Short Sleeve Shirt',
    price: '2.000.000,00',
    imageUrl: '/product6.png',
  },
  {
    name: '"Nitik Cerah" - Kids Baju Panjang',
    price: '1.300.000,00',
    imageUrl: '/product7.png',
  },
];

const productsRow3: Product[] = [
  {
    name: '"Nitik Cerah" - Kids Shirt',
    price: '950.000,00',
    imageUrl: '/product8.png',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" Baju Panjang',
    price: '2.700.000,00',
    imageUrl: '/product9.png',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" Short Sleeve Shirt',
    price: '2.700.000,00',
    imageUrl: '/product10.png',
  },
];

export default function ProductContainer() {
  return (
    <section className="w-full bg-white py-12">
      {/* First row: left text + 3 products */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Left text column */}
        <div className="flex flex-col items-center justify-center px-8 py-12 md:col-span-1 border-r border-gray-200">
          <h2 className="text-3xl font-light mb-6 text-center text-black">For Family<br />Moments<br />That Matter</h2>
          <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop Now</a>
        </div>
        {/* Product cards row 1 */}
        {products.map((product, idx) => (
          <div key={idx} className="flex flex-col items-center px-6 py-8 text-left">
            <img src={product.imageUrl} alt={product.name} className="h-72 object-contain mb-6" />
            <div className="font-bold text-lg text-black mb-2">{product.name}</div>
            <div className="text-gray-700 text-base font-normal">{product.price}</div>
          </div>
        ))}
      </div>
      {/* Second row: 4 products, no left text */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {productsRow2.map((product: Product, idx: number) => (
          <div key={idx} className="flex flex-col items-center px-6 py-8 text-left">
            <img src={product.imageUrl} alt={product.name} className="h-72 object-contain mb-6" />
            <div className="font-bold text-lg text-black mb-2">{product.name}</div>
            <div className="text-gray-700 text-base font-normal">{product.price}</div>
          </div>
        ))}
      </div>
      {/* Third row: 3 products + right column with button */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Product cards row 3 */}
        {productsRow3.map((product: Product, idx: number) => (
          <div key={idx} className="flex flex-col items-center px-6 py-8 text-left">
            <img src={product.imageUrl} alt={product.name} className="h-72 object-contain mb-6" />
            <div className="font-bold text-lg text-black mb-2">{product.name}</div>
            <div className="text-gray-700 text-base font-normal">{product.price}</div>
          </div>
        ))}
        {/* Right column with button */}
        <div className="flex flex-col items-center justify-center px-8 py-8">
          <a href="#" className="bg-black text-white rounded-full px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition">VIEW ALL PRODUCTS</a>
        </div>
      </div>
    </section>
  );
}
