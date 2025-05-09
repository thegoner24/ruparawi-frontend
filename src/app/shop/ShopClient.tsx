"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { addCartItem, fetchCart } from "../cart/api";
import { addToWishlist, removeFromWishlist } from "../controllers/wishlistController";
import { useAuth } from "@/app/context/AuthContext";

// Define cart item type
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
  isFeatured?: boolean;
  [key: string]: any;
}

interface CategoryGroup {
  parent: string;
  subs: string[];
}

interface ShopClientProps {}

// Define CategoryNode type for recursive category mapping
interface CategoryNode {
  id: string;
  name: string;
  subcategories?: CategoryNode[];
}

const PRODUCTS_PER_PAGE = 12;

const ShopClient: React.FC<ShopClientProps> = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const { refreshCart } = useCart();
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesRaw, setCategoriesRaw] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map products with parentCategory and category (subcategory) names using category_id
  useEffect(() => {
    // Helper: recursively flatten all categories and subcategories
    function flattenCategories(nodes: CategoryNode[], parentName: string | null = null): { id: string; name: string; parent: string | null }[] {
      let result: { id: string; name: string; parent: string | null }[] = [];
      for (const node of nodes) {
        result.push({ id: node.id, name: node.name, parent: parentName });
        if (node.subcategories && node.subcategories.length > 0) {
          result = result.concat(flattenCategories(node.subcategories, node.name ?? null));
        }
      }
      return result;
    }

    // Build lookup: category_id -> { sub, parent }
    const categoryIdToNames: { [key: string]: { sub: string; parent: string } } = {};
    if (Array.isArray(categoriesRaw) && categoriesRaw.length > 0) {
      const categoriesFlat = flattenCategories(categoriesRaw);
      for (const entry of categoriesFlat) {
        categoryIdToNames[entry.id] = { sub: entry.name, parent: entry.parent || entry.name };
      }
    }

    // Map products
    const allProductsWithNames = rawProducts.map(product => {
      const mapping = categoryIdToNames[product.category_id];
      return {
        ...product,
        category: mapping ? mapping.sub : "Unknown",
        parentCategory: mapping ? mapping.parent : "Other"
      };
    });
    setProducts(allProductsWithNames);
  }, [rawProducts, categoriesRaw]);


  // Fetch categories on mount (store both raw tree and flat for UI dropdowns)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products/category', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const raw = await res.json();
        const tree = raw.data.categories || [];
        setCategoriesRaw(tree);
        // For dropdown UI: build CategoryGroup[] (parent/sub names only, for UI compatibility)
        const groups = tree.map((cat: any) => ({
          parent: cat.name,
          subs: (cat.subcategories || []).map((sub: any) => sub.name)
        }));
        setCategories(groups);
      } catch (err) {
        setCategories([]);
        setCategoriesRaw([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch first page to get pagination info
        const res = await fetch('https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products?page=1', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const { products: firstPageProducts, pagination } = data;
        if (!pagination || !pagination.pages || pagination.pages === 1) {
          setProducts(firstPageProducts || data.products || data);
          setLoading(false);
          return;
        }
        // Fetch all remaining pages in parallel
        const pageFetches = [];
        for (let page = 2; page <= pagination.pages; page++) {
          pageFetches.push(
            fetch(`https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products?page=${page}`, { cache: 'no-store' })
              .then(r => {
                if (!r.ok) throw new Error('Failed to fetch products page ' + page);
                return r.json();
              })
              .then(d => d.products || d)
          );
        }
        const restPagesProducts = await Promise.all(pageFetches);
        // Flatten all products
        const allProducts = [
          ...(firstPageProducts || []),
          ...restPagesProducts.flat()
        ];
        setRawProducts(allProducts);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);
  const [selectedParent, setSelectedParent] = useState("All");
  const [selectedSub, setSelectedSub] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartNotification, setCartNotification] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  // Load cart items from backend on component mount
  useEffect(() => {
    async function loadCart() {
      try {
        const data = await fetchCart();
        setCartItems(data.cart_items || []);
      } catch (err) {
        setCartItems([]);
      }
    }
    loadCart();
  }, []);

  // Function to handle quick view button click
  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  // Function to handle wishlist button click
  const { token } = useAuth();
  const handleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      setCartMessage('You must be logged in to use the wishlist.');
      setCartNotification(true);
      setTimeout(() => setCartNotification(false), 3500);
      return;
    }
    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(Number(productId), token);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await addToWishlist(Number(productId), token);
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      setCartMessage('Failed to update wishlist.');
      setCartNotification(true);
      setTimeout(() => setCartNotification(false), 3500);
      console.error(err);
    }
  };

  // Function to add item to cart using backend API (with upgraded error handling)
  const addToCart = useCallback(async (product: Product, quantity: number = 1, size: string = "M", color: string = "Black") => {
    if (!token) {
      setCartMessage('You must be logged in to add items to the cart.');
      setCartNotification(true);
      setTimeout(() => {
        setCartNotification(false);
        setCartMessage(null);
      }, 3500);
      return;
    }
    const payload = {
      product_id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id,
      quantity,
      size,
      color,
    };
    console.log('Add to cart payload:', payload);
    try {
      const response = await addCartItem(payload);
      console.log('Add to cart response:', response);
      // Optionally reload cartItems from backend
      const data = await fetchCart();
      setCartItems(data.cart_items || []);
      await refreshCart(); // <-- Ensure Navbar badge updates
      setCartMessage(response.message || 'Added to cart!');
      setCartNotification(true);
      setTimeout(() => {
        setCartNotification(false);
        setCartMessage(null);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err instanceof Error && err.message) {
        setCartMessage(err.message);
      } else {
        setCartMessage('Failed to add to cart.');
      }
      setCartNotification(true);
      setTimeout(() => {
        setCartNotification(false);
        setCartMessage(null);
      }, 3000);
    }
  }, [token, refreshCart]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Function to close quick view modal
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Filter products by search and category
  const filteredProducts = products.filter(product => {
    const matchesParent = selectedParent === "All" || product.parentCategory === selectedParent;
    const matchesSub = selectedSub === "All" || product.category === selectedSub;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesParent && matchesSub && matchesSearch;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
    // Default: featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  // Reset to first page when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedParent, selectedSub, sortOption]);

  return (
    <section className="container mx-auto px-4">
      {/* Loader */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      )}
      {/* Error state */}
      {error && (
        <div className="text-red-500 py-8 text-center">{error}</div>
      )}
      {/* Search bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black shadow-sm"
        />
      </div>
      {/* Category filter and sort dropdown (single context) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <select
            value={selectedParent}
            onChange={e => {
              setSelectedParent(e.target.value);
              setSelectedSub("All");
            }}
            className="border rounded px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.parent} value={cat.parent}>{cat.parent}</option>
            ))}
          </select>
          <select
            value={selectedSub}
            onChange={e => setSelectedSub(e.target.value)}
            className="border rounded px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
            disabled={selectedParent === "All"}
          >
            <option value="All">All Subcategories</option>
            {categories.find(cat => cat.parent === selectedParent)?.subs.map(sub => (
              <option key={`${selectedParent}-${sub}`} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map(product => (
          <div key={product.id} className="group rounded-2xl p-0 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-[#ede9dd] overflow-hidden flex flex-col">
            <Link href={`/shop/${product.id}`}
              className="block mb-2"
            >
              <div className="relative w-full aspect-[4/5] min-h-[210px] flex items-end justify-center overflow-hidden bg-gradient-to-br from-[#f8f5f0] to-[#e7e2d1]">
  <img
  src={product.primary_image_url ?? product.image ?? '/placeholder.png'}
  alt={product.name}
  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-gray-100 rounded-2xl"
  onError={e => {
    // Prevent infinite loop by checking a custom property
    const img = e.target as HTMLImageElement;
    if (!img.dataset.fallback) {
      img.dataset.fallback = 'true';
      img.src = '/placeholder.png';
    }
  }}
/>
  <button
    onClick={e => handleWishlist(e, product.id)}
    className={`absolute top-3 right-3 p-2 rounded-full shadow bg-white/80 hover:bg-[#f2e6c7] transition ${wishlist.includes(product.id) ? 'text-[#d4b572]' : 'text-gray-400'}`}
    aria-label="Add to wishlist"
  >
    <svg className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-[#d4b572]' : ''}`} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </button>
              </div>
            </Link>
            <div className="flex flex-col gap-2 px-4 pb-4 pt-2 flex-1">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[48px]">{product.name}</h3>
              <span className="text-[#bfa76a] font-bold text-lg mb-1">{product.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={e => handleQuickView(e, product)}
                  className="text-xs px-3 py-1 rounded-full bg-[#f8f5f0] text-gray-700 hover:bg-[#ede9dd] hover:text-black transition font-medium shadow-sm border border-[#ede9dd]"
                >
                  Quick View
                </button>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full bg-gradient-to-r from-[#bfa76a] to-[#e0cba8] text-white py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={closeQuickView}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 aspect-[4/5] min-h-[210px] flex items-end justify-center overflow-hidden bg-gradient-to-br from-[#f8f5f0] to-[#e7e2d1] rounded-2xl">
  <img src={quickViewProduct.primary_image_url ?? quickViewProduct.image ?? '/placeholder.png'} alt={quickViewProduct.name} className="w-full h-full object-cover bg-gray-100 rounded-2xl" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
</div>
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{quickViewProduct.name}</h2>
                <span className="text-[#d4b572] font-bold text-xl mb-2">${quickViewProduct.price}</span>
                <p className="text-gray-700 mb-2">
                  {quickViewProduct.category === "Jackets" ?
                    "Premium quality jacket with modern fit and durable materials. Stay stylish and warm all season." :
                    quickViewProduct.category === "Shirts" ?
                    "Elegant shirt made from high-quality fabric. Perfect for both casual and formal occasions with its timeless design." :
                    "Luxurious accessory designed to elevate your style. Made with premium materials and expert craftsmanship."}
                </p>
                <div className="mt-auto space-y-4">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      closeQuickView();
                    }}
                    className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      handleWishlist(new MouseEvent('click') as any, quickViewProduct.id);
                      closeQuickView();
                    }}
                    className="w-full border border-[#e8d8b9] bg-white text-black py-3 rounded-md font-medium hover:bg-[#f8f5f0] transition-colors flex items-center justify-center"
                  >
                    <svg
                      className={`w-5 h-5 mr-2 ${wishlist.includes(quickViewProduct.id) ? 'text-[#d4b572] fill-[#d4b572]' : 'text-gray-700'}`}
                      fill={wishlist.includes(quickViewProduct.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlist.includes(quickViewProduct.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  <Link
                    href={`/shop/${quickViewProduct.id}`}
                    className="block w-full text-center underline text-gray-700 hover:text-black transition-colors"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    {/* Notification UI */}
    {cartNotification && cartMessage && (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center text-sm font-semibold animate-fadeIn">
        {cartMessage}
      </div>
    )}
    </section>
  );
};

export default ShopClient;
