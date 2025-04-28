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
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH0967-1.jpg?v=1741603515&width=1080x',
  },
  {
    name: '"Tenun Ombak Laut" - Long Sleeve Shirt',
    price: '3.350.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH0073-1.jpg?v=1741604071&width=1080',
  },
  {
    name: '"Bambu Onde" - Plant-based Dye Baju Panjang',
    price: '2.600.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/DSC02298-1.jpg?v=1741684457&width=1080',
  },
];

const productsRow2: Product[] = [
  {
    name: '"Nitik Ayam" - Kids Shirt',
    price: '950.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/2_1397ed9e-189e-44ad-8be6-9ec93f2ecdee.jpg?v=1719378370&width=1080',
  },
  {
    name: '"Nitik Cerah" - Baju Panjang',
    price: '2.100.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH0449-1.jpg?v=1741583059&width=1080',
  },
  {
    name: '"Nitik Cerah" - Short Sleeve Shirt',
    price: '2.000.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH0017-1.jpg?v=1741582005&width=1080',
  },
  {
    name: '"Nitik Cerah" - Kids Baju Panjang',
    price: '1.300.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH1979-1.jpg?v=1741600535&width=1080',
  },
];

const productsRow3: Product[] = [
  {
    name: '"Nitik Cerah" - Kids Shirt',
    price: '950.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/SEJAUH2251-1.jpg?v=1741583656&width=1080',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" Baju Panjang',
    price: '2.700.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/Tumbnailwebbpeko1.jpg?v=1733473322&width=1080',
  },
  {
    name: '"Sejauh Mata Memandang X Eko Nugroho" Short Sleeve Shirt',
    price: '2.700.000,00',
    imageUrl: 'https://sejauh.com/cdn/shop/files/Tumbnailwebkemejaeko1.jpg?v=1733477491&width=1080',
  },
];

export default function ProductContainer() {
  return (
    <section className="w-full bg-white">
      {/* First row: left text + 3 products */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Left text column */}
        <div className="flex flex-col items-center justify-center px-8 py-12 md:col-span-1 border-r border-gray-200">
          <h2 className="text-3xl font-light mb-6 text-center text-black">For Family<br />Moments<br />That Matter</h2>
          <a href="#" className="mt-4 text-base font-medium text-black border border-black rounded-full px-6 py-2 hover:bg-black hover:text-white transition">Shop Now</a>
        </div>
        {/* Product cards row 1 */}
        {products.map((product, idx) => (
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
      </div>
      {/* Second row: 4 products, no left text */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {productsRow2.map((product: Product, idx: number) => (
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
      </div>
      {/* Third row: 3 products + right column with button */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
        {/* Product cards row 3 */}
        {productsRow3.map((product: Product, idx: number) => (
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
        {/* Right column with button */}
        <div className="flex flex-col items-center justify-center px-8 py-8">
          <a href="/shop" className="bg-black text-white rounded-full px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition">VIEW ALL PRODUCTS</a>
        </div>
      </div>
    </section>
  );
}
