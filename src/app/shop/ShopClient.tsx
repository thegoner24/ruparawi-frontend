"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import CartController from "../controllers/cartController";

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

interface ShopClientProps {
  categories: string[];
}

const ShopClient: React.FC<ShopClientProps> = ({ categories }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products || data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartNotification, setCartNotification] = useState(false);

  // Load cart items on component mount
  useEffect(() => {
    setCartItems(CartController.getItems());
    const handleCartUpdate = (event: any) => {
      if (event.detail && event.detail.cartItems) {
        setCartItems(event.detail.cartItems);
      }
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Function to handle quick view button click
  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  // Function to handle wishlist button click
  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Function to close quick view modal
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Function to add item to cart using CartController
  const addToCart = useCallback((product: Product, quantity: number = 1, size: string = "M", color: string = "Black") => {
    CartController.addItem(product, quantity, size, color);
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 3000);
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
    // Default: featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

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
      {/* Cart notification */}
      {cartNotification && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Added to cart!
        </div>
      )}
      {/* Category filter and sort dropdown (single context) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-black text-white' : 'bg-[#f8f5f0] text-gray-700'} text-sm`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
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
        {sortedProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition relative">
            <Link href={`/shop/${product.id}`}
              className="block mb-2"
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
            </Link>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <span className="text-[#d4b572] font-bold text-xl">${product.price}</span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={e => handleQuickView(e, product)}
                  className="text-xs underline text-gray-600 hover:text-black"
                >
                  Quick View
                </button>
                <button
                  onClick={e => handleWishlist(e, product.id)}
                  className="ml-2"
                  aria-label="Add to wishlist"
                >
                  <svg className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-[#d4b572] fill-[#d4b572]' : 'text-gray-700'}`} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-900"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full md:w-1/2 h-56 object-cover rounded" />
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
    </section>
  );
};

export default ShopClient;
