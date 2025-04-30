"use client";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import CartController from "../controllers/cartController";

// Product categories
const categories = [
  "All",
  "Jackets",
  "Shirts",
  "Accessories",
  "Limited Edition"
];



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

export default function ShopPage() {
  // Products state and fetch logic (MOVED INSIDE COMPONENT)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products || data); // Adjust if API response shape is different
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
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartNotification, setCartNotification] = useState(false);
  
  // Load cart items on component mount
  useEffect(() => {
    setCartItems(CartController.getItems());
    
    // Listen for cart updates
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
  const handleQuickView = (e: React.MouseEvent, product: any) => {
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
  const addToCart = useCallback((product: any, quantity: number = 1, size: string = "M", color: string = "Black") => {
    // Use CartController to add item to cart
    CartController.addItem(product, quantity, size, color);
    
    // Show notification
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
    if (sortOption === "rating") return b.rating - a.rating;
    // Default: featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-white">
      
      {/* Cart notification */}
      {cartNotification && (
        <div className="fixed top-4 right-4 bg-white border border-[#d4b572] shadow-lg rounded-lg p-4 z-50 animate-fadeIn flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Item added to cart!</p>
            <Link href="/cart" className="text-sm text-[#d4b572] hover:underline">View cart</Link>
          </div>
          <button 
            onClick={() => setCartNotification(false)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop Collection</h1>
          
          <button 
            className="flex items-center text-gray-700 hover:text-black"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filter
          </button>
        </div>
        
        {/* Filter panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category 
                      ? 'bg-black text-white' 
                      : 'bg-[#f8f5f0] text-gray-800 hover:bg-[#e8d8b9]/30'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4b572] focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* New tag */}
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                )}
                
                {/* Product image with hover actions */}
                <Link href={`/shop/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-80 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Quick actions - only visible on image hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => handleQuickView(e, product)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => handleWishlist(e, product.id)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg 
                            className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-[#d4b572] fill-[#d4b572]' : 'text-gray-700'}`} 
                            fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Product info */}
                <div className="p-4">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="text-gray-900 font-medium text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold">
                        {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                      </span>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-[#d4b572]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-700 text-sm ml-1">{product.rating}</span>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Add to Cart button - always visible and functional */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try changing your filters or check back later for new items.</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-md bg-white shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className="px-4 py-2 rounded-md bg-black text-white font-medium">1</button>
            <button className="px-4 py-2 rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50">2</button>
            <button className="px-4 py-2 rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50">3</button>
            
            <span className="px-2 text-gray-500">...</span>
            
            <button className="px-4 py-2 rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50">8</button>
            
            <button className="px-3 py-2 rounded-md bg-white shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </main>
      
      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button 
                onClick={closeQuickView}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Product Image */}
                <div className="bg-[#f8f5f0] rounded-lg overflow-hidden flex items-center justify-center p-4" style={{ minHeight: '400px' }}>
                  <img 
                    src={quickViewProduct.image} 
                    alt={quickViewProduct.name} 
                    className="object-contain max-h-[350px] w-full" 
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{quickViewProduct.name}</h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'text-[#d4b572]' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-700 text-sm ml-1">{quickViewProduct.rating} rating</span>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-black mb-4">
                    {quickViewProduct.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    {quickViewProduct.category === "Jackets" ? 
                      "Premium quality jacket crafted with attention to detail. Features a comfortable fit and durable materials for long-lasting wear." :
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
        </div>
      )}
      
      {/* Newsletter section */}
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
      
      {/* Back to top button */}
      <button className="fixed bottom-8 right-8 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors duration-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
