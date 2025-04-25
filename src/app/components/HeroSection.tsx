"use client";

export default function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center py-16 px-4 bg-white">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">Sejauh Mata Memandang</h1>
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
        Indonesian textile & lifestyle brand celebrating rich multicultural heritage and expert craftsmanship. Sustainable collections crafted across villages, cities, and various production scales.
      </p>
      <a href="#family" className="inline-block px-8 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition">Lihat Koleksi</a>
    </section>
  );
}
