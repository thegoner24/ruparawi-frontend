import Link from "next/link";
import ShopClient from "./ShopClient";

// Fetch categories from API (Next.js app directory, server component)
async function getCategories() {
  try {
    const res = await fetch('https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products/category', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    // Recursively extract all category names (including subcategories)
    function extractNames(categories: any[]): string[] {
      let names: string[] = [];
      for (const cat of categories) {
        names.push(cat.name);
        if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
          names = names.concat(extractNames(cat.subcategories));
        }
      }
      return names;
    }
    const categoriesArr = json?.data?.categories ? extractNames(json.data.categories) : [];
    return ['All', ...categoriesArr];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['All'];
  }
}

// SSR page component
type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
  isFeatured?: boolean;
  [key: string]: any;
};

export default async function ShopPage() {
  console.log('ShopPage rendered');
  // Fetch categories on server
  const categories = await getCategories();
  // Only pass categories; product fetching is now client-side
  return (
    <div className="min-h-screen bg-white">
      <section className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold mb-6">Shop</h1>
      </section>
      <ShopClient categories={categories} />
      <section className="bg-[#f8f5f0] py-12 mt-16 border-t border-[#e8d8b9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Stay updated with our latest collections and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4b572] focus:border-transparent"
              required
            />
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <button className="fixed bottom-8 right-8 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors duration-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}

