"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

// Define types
type ProductColor = string;
type ProductSize = string;

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
}

// Sample product data - in a real app, you would fetch this from an API
const products: ProductDetail[] = [
  {
    id: "modern-hooded-jacket",
    name: "Modern Hooded Jacket",
    category: "Jackets",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580331451062-99ff207885a7?auto=format&fit=crop&w=800&q=80"
    ],
    price: 3900000,
    rating: 4.5,
    reviewCount: 24,
    description: "A modern hooded jacket crafted with premium materials for both style and comfort. Features a relaxed fit with smart pockets and adjustable hood. Perfect for layering in transitional weather.",
    details: [
      "100% premium cotton shell",
      "Relaxed, contemporary fit",
      "Two-way zipper closure",
      "Adjustable drawstring hood",
      "Side pockets with hidden zippers",
      "Machine washable"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Olive"],
    isFeatured: true,
    isNew: true,
    inStock: true
  },
  {
    id: "classic-oxford-shirt",
    name: "Classic Oxford Shirt",
    category: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?auto=format&fit=crop&w=800&q=80"
    ],
    price: 1200000,
    rating: 4.2,
    reviewCount: 18,
    description: "A timeless Oxford shirt made from premium cotton with a classic button-down collar. Features a comfortable regular fit that's perfect for both casual and semi-formal occasions.",
    details: [
      "100% premium cotton",
      "Regular fit",
      "Button-down collar",
      "Single chest pocket",
      "Pearl buttons",
      "Machine washable"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    isFeatured: false,
    isNew: false,
    inStock: true
  }
];

export default function ProductDetail() {
  const params = useParams();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product data
  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = () => {
      setLoading(true);
      // Find product by ID
      const foundProduct = products.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        // Set defaults
        setSelectedSize(foundProduct.sizes[0]);
        setSelectedColor(foundProduct.colors[0]);
      }
      
      setLoading(false);
    };
    
    fetchProduct();
  }, [productId]);
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden bg-[#f8f5f0] rounded-lg border border-[#e8d8b9]">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
              
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto py-2">
              {product.images.map((image: string, index: number) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-black' : 'ring-1 ring-[#e8d8b9]'}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - View ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            {/* Product Title and Price */}
            <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#d4b572]' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-700 text-sm ml-1">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
              <span className="text-2xl font-bold text-black">
                {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
              </span>
            </div>
            
            {/* Product Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color: ProductColor) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedColor === color ? 'ring-2 ring-black ring-offset-2' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() === 'white' ? 'white' : color.toLowerCase() === 'light blue' ? '#add8e6' : color.toLowerCase() === 'pink' ? '#ffc0cb' : color.toLowerCase() === 'navy' ? '#000080' : color.toLowerCase() === 'olive' ? '#808000' : color.toLowerCase() }}
                  >
                    {selectedColor === color && color.toLowerCase() === 'white' && (
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {selectedColor === color && color.toLowerCase() !== 'white' && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Selected: {selectedColor}</p>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <button className="text-sm font-medium text-black hover:text-[#d4b572] transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size: ProductSize) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-[#e8d8b9]'} rounded-md text-sm font-medium transition-colors`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-black"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-black"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors mb-4">
              Add to Cart
            </button>
            
            {/* Wishlist Button */}
            <button className="w-full border border-[#e8d8b9] bg-white text-black py-3 rounded-md font-medium hover:bg-[#f8f5f0] transition-colors mb-6 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Add to Wishlist
            </button>
            
            {/* Product Details */}
            <div className="border-t border-[#e8d8b9] pt-6">
              <h3 className="text-lg font-medium text-black mb-4">Product Details</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {product.details.map((detail: string, index: number) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <section className="container mx-auto px-4 py-12 border-t border-[#e8d8b9] mt-12">
        <h2 className="text-2xl font-bold text-black mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => p.id !== productId).map(relatedProduct => (
            <Link href={`/shop/${relatedProduct.id}`} key={relatedProduct.id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                {relatedProduct.isNew && (
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                )}
                
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img 
                    src={relatedProduct.images[0]} 
                    alt={relatedProduct.name} 
                    className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-gray-900 font-medium text-lg mb-1">{relatedProduct.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{relatedProduct.category}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">
                      {relatedProduct.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                    </span>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-[#d4b572]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-700 text-sm ml-1">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
