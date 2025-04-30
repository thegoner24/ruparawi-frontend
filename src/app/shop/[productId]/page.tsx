"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

// Define types
type ProductColor = string;
type ProductSize = string;

interface ProductDetail {
  id: number;
  name: string;
  description?: string;
  price: number;
  tags: string[] | string;
  sustainability_attributes?: string[] | string;
  stock_quantity?: number;
  min_order_quantity?: number;
  is_active?: boolean;
  image?: string;
  [key: string]: any;
}

// Product details will now be fetched from the API

export default function ProductDetail() {
  const params = useParams();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product data from API
  useEffect(() => {
    if (!productId) {
      setError('Invalid product ID');
      return;
    }
    setLoading(true);
    fetch(`https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products/${parseInt(productId, 10)}`)
      .then((res: Response) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        console.log('Fetched product data:', data);
        if (data && data.product) {
          // Parse tags and sustainability_attributes if needed
          let prod = { ...data.product };
          if (typeof prod.tags === 'string') {
            try { prod.tags = JSON.parse(prod.tags.replace(/'/g, '"')); } catch { prod.tags = []; }
          }
          if (typeof prod.sustainability_attributes === 'string') {
            try { prod.sustainability_attributes = JSON.parse(prod.sustainability_attributes.replace(/'/g, '"')); } catch { prod.sustainability_attributes = []; }
          }
          setProduct(prod);
          setError(null);
        } else {
          setProduct(null);
          setError('Invalid product data from API');
        }
        // Set defaults if available
        if (data.product && data.product.sizes && data.product.sizes.length > 0) setSelectedSize(data.product.sizes[0]);
        if (data.product && data.product.colors && data.product.colors.length > 0) setSelectedColor(data.product.colors[0]);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Error loading product:', err);
        setError('Failed to load product data');
        setLoading(false);
      });
  }, [productId]);

  // Fetch all products for related products section
  const [allProducts, setAllProducts] = useState<ProductDetail[]>([]);
  useEffect(() => {
    fetch('https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const products = Array.isArray(data.products) ? data.products : data;
        console.log('Fetched all products:', products);
        setAllProducts(products);
      })
      .catch((err) => {
        console.error('Error fetching all products:', err);
        setAllProducts([]);
      });
  }, []);
  
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
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* No images field in new schema. Show a placeholder image only. */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-[#f8f5f0] rounded-lg border border-[#e8d8b9] flex items-center justify-center">
              <img 
                src="/placeholder.png"
                alt="No image"
                className="w-1/2 h-1/2 object-contain opacity-40"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            {/* Product Title and Price */}
            <h1 className="text-3xl font-bold text-black mb-2">{product.name || "Product name not available"}</h1>
            <div className="flex items-center mb-4">
              {/* No rating/review fields in new schema. */}
              
              <span className="text-2xl font-bold text-black">
                {typeof product.price === 'number'
                  ? product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
                  : 'Price not available'}
              </span>
            </div>
            
            {/* Product Description */}
            <p className="text-gray-700 mb-6">{product.description || 'No description available.'}</p>
            
            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(product.tags) && product.tags.length > 0 ? (
                  product.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-700">{tag}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">No tags</span>
                )}
              </div>
            </div>
            {/* Sustainability Attributes */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sustainability Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(product.sustainability_attributes) && product.sustainability_attributes.length > 0 ? (
                  product.sustainability_attributes.map((attr: string) => (
                    <span key={attr} className="px-2 py-1 bg-green-100 rounded text-xs text-green-700">{attr}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">No sustainability attributes</span>
                )}
              </div>
            </div>
            {/* Stock and Status */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Stock &amp; Status</h3>
              <div className="flex flex-col gap-1">
                <span>Stock: <b>{typeof product.stock_quantity === 'number' ? product.stock_quantity : 'N/A'}</b></span>
                <span>Minimum Order: <b>{typeof product.min_order_quantity === 'number' ? product.min_order_quantity : 'N/A'}</b></span>
                <span>Status: <b className={product.is_active ? 'text-green-600' : 'text-red-600'}>{product.is_active ? 'Active' : 'Inactive'}</b></span>
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
            
            
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <section className="container mx-auto px-4 py-12 border-t border-[#e8d8b9] mt-12">
        <h2 className="text-2xl font-bold text-black mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(allProducts) && allProducts.length > 0 ? (
            allProducts
              .filter((relatedProduct: ProductDetail) => relatedProduct.id && (!product || relatedProduct.id !== (product as any).id))
              .map((relatedProduct: ProductDetail) => {
                // Parse tags if needed
                let tags: string[] = [];
                if (Array.isArray(relatedProduct.tags)) {
                  tags = relatedProduct.tags;
                } else if (typeof relatedProduct.tags === 'string') {
                  try {
                    tags = JSON.parse(relatedProduct.tags.replace(/'/g, '"'));
                  } catch {
                    tags = [];
                  }
                }
                // Parse sustainability_attributes if needed
                let sustainability: string[] = [];
                if (Array.isArray(relatedProduct.sustainability_attributes)) {
                  sustainability = relatedProduct.sustainability_attributes;
                } else if (typeof relatedProduct.sustainability_attributes === 'string') {
                  try {
                    sustainability = JSON.parse(relatedProduct.sustainability_attributes.replace(/'/g, '"'));
                  } catch {
                    sustainability = [];
                  }
                }
                return (
                  <Link href={`/shop/${relatedProduct.id}`} key={relatedProduct.id} className="group border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition-shadow block">
                    <div className="flex flex-col items-start">
                      <div className="w-full flex justify-center mb-2">
                        <img
                          src={relatedProduct.image || '/placeholder.png'}
                          alt={relatedProduct.name || 'Product'}
                          className="w-24 h-24 object-contain bg-gray-100 rounded mb-2"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                        />
                      </div>
                      <h3 className="text-gray-900 font-medium text-lg mb-1">{relatedProduct.name || "Name not available"}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.length > 0 ? tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-700">{tag}</span>
                        )) : <span className="text-gray-400 text-xs italic">No tags</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {sustainability.length > 0 ? sustainability.map((attr: string) => (
                          <span key={attr} className="px-2 py-1 bg-green-100 rounded text-xs text-green-700">{attr}</span>
                        )) : <span className="text-gray-400 text-xs italic">No sustainability</span>}
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-gray-900 font-bold">
                          {typeof relatedProduct.price === 'number'
                            ? relatedProduct.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
                            : 'Price not available'}
                        </span>
                        <span className={relatedProduct.is_active ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
                          {relatedProduct.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-xs mt-2">Stock: <b>{typeof relatedProduct.stock_quantity === 'number' ? relatedProduct.stock_quantity : 'N/A'}</b></div>
                      <div className="text-xs">Min Order: <b>{typeof relatedProduct.min_order_quantity === 'number' ? relatedProduct.min_order_quantity : 'N/A'}</b></div>
                    </div>
                  </Link>
                );
              })
          ) : (
            <div className="col-span-4 text-gray-400 text-center italic">No related products found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
