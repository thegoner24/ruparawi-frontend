"use client";
import { useState, useEffect } from "react";
import WishlistCartActions from "./WishlistCartActions";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchProductReviews, addProductReview, Review } from "../../api/reviews";

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
images?: string[];
  [key: string]: any;
}

// Product details will now be fetched from the API
// WishlistCartActions handles add to cart and wishlist logic and UI


export default function ProductDetail() {
  const { productId } = useParams();
  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number | ''>('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string | null>(null);

  // Fetch reviews
  useEffect(() => {
    if (!productId) return;
    setReviewLoading(true);
    setReviewError(null);
    fetchProductReviews(Number(Array.isArray(productId) ? productId[0] : productId))
      .then((data: Review[]) => {
        setReviews(Array.isArray(data) ? data : []);
        setReviewLoading(false);
      })
      .catch((err: unknown) => {
        setReviewError('Failed to load reviews');
        setReviewLoading(false);
      });
  }, [productId]);

  // Handle review submission
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewRating || !reviewContent) {
      setReviewSubmitError('Please provide both a rating and review.');
      return;
    }
    setReviewSubmitting(true);
    setReviewSubmitError(null);
    try {
      await addProductReview({
        product_id: Number(Array.isArray(productId) ? productId[0] : productId),
        rating: reviewRating,
        comment: reviewContent,
        user_id: 1, // TODO: Replace with real user id from auth
      });
      setReviewContent('');
      setReviewRating('');
      // Refresh reviews
      setReviewLoading(true);
      const data = await fetchProductReviews(Number(Array.isArray(productId) ? productId[0] : productId));
      setReviews(Array.isArray(data) ? data : []);
      setReviewLoading(false);
    } catch (err: any) {
      setReviewSubmitError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  }

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [vendorName, setVendorName] = useState<string | null>(null);
  // Track image load error to prevent infinite reload
  const [imgError, setImgError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
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
    const id = Array.isArray(productId) ? productId[0] : productId;
    fetch(`https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products/${parseInt(id, 10)}`)
      .then((res: Response) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then((data) => {
        if (data && data.product) {
          let prod = { ...data.product };
          // Parse tags and sustainability_attributes if needed
          if (typeof prod.tags === 'string') {
            try { prod.tags = JSON.parse(prod.tags.replace(/'/g, '"')); } catch { prod.tags = []; }
          }
          if (typeof prod.sustainability_attributes === 'string') {
            try { prod.sustainability_attributes = JSON.parse(prod.sustainability_attributes.replace(/'/g, '"')); } catch { prod.sustainability_attributes = []; }
          }
          // Parse images field if present (stringified list of objects)
          if (typeof prod.images === 'string') {
            try {
              // Attempt to convert single quotes to double quotes only for JSON keys/values
              let imagesStr = prod.images
                .replace(/\b(True|False|null)\b/g, (match: string) => match.toLowerCase()) // Python->JS bool/null
                .replace(/'/g, '"');
              const parsedImages = JSON.parse(imagesStr);
              if (Array.isArray(parsedImages)) {
                prod.imagesArray = parsedImages;
                // Find primary image
                const primary = parsedImages.find((img: any) => img.is_primary && img.image_url);
                prod.primary_image_url = primary?.image_url || (parsedImages[0]?.image_url ?? undefined);
              }
            } catch (e) {
              prod.imagesArray = [];
            }
          }
          setProduct(prod);
          // Set vendor name if present
          if (prod.business_name) {
            setVendorName(prod.business_name);
          } else if (prod.vendor_id) {
            fetch(`https://mad-adriane-dhanapersonal-9be85724.koyeb.app/admin/vendors/${prod.vendor_id}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => {
                if (data && data.vendor && data.vendor.name) {
                  setVendorName(data.vendor.name);
                } else {
                  setVendorName(null);
                }
              })
              .catch(() => setVendorName(null));
          } else {
            setVendorName(null);
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
      .then(async data => {
        let products = Array.isArray(data.products) ? data.products : data;
        // Parse tags for matching
        products = products.map((prod: any) => {
          const p = { ...prod };
          if (typeof p.tags === 'string') {
            try { p.tags = JSON.parse(p.tags.replace(/'/g, '"')); } catch { p.tags = []; }
          }
          return p;
        });
        // Fetch details for each product (in parallel)
        const detailedProducts = await Promise.all(products.map(async (prod: any) => {
          try {
            const res = await fetch(`https://mad-adriane-dhanapersonal-9be85724.koyeb.app/products/${prod.id}`);
            if (!res.ok) return prod;
            const detail = await res.json();
            if (detail && detail.product) {
              let p = { ...prod, ...detail.product };
              // Parse tags and sustainability_attributes if needed
              if (typeof p.tags === 'string') {
                try { p.tags = JSON.parse(p.tags.replace(/'/g, '"')); } catch { p.tags = []; }
              }
              if (typeof p.sustainability_attributes === 'string') {
                try { p.sustainability_attributes = JSON.parse(p.sustainability_attributes.replace(/'/g, '"')); } catch { p.sustainability_attributes = []; }
              }
              if (typeof p.stock_quantity === 'string') {
                const n = Number(p.stock_quantity);
                p.stock_quantity = isNaN(n) ? undefined : n;
              }
              if (typeof p.min_order_quantity === 'string') {
                const n = Number(p.min_order_quantity);
                p.min_order_quantity = isNaN(n) ? undefined : n;
              }
              return p;
            }
            return prod;
          } catch {
            return prod;
          }
        }));
        console.log('Fetched all related products with details:', detailedProducts);
        setAllProducts(detailedProducts);
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
  
  if (product) {
  console.log('DEBUG Product for vendor display:', product);
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
          {/* Product Images Display */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full h-96 overflow-hidden bg-[#f8f5f0] rounded-lg border border-[#e8d8b9] flex items-center justify-center">
              {(() => {
                // Get all images from imagesArray, images, or fallback
                let images: string[] = [];
                if (Array.isArray(product?.imagesArray) && product.imagesArray.length > 0) {
                  images = product.imagesArray.map((img: any) => img.image_url).filter((url: string) => !!url);
                } else if (Array.isArray(product?.images) && product.images.length > 0) {
                  images = product.images.filter((url: string) => !!url);
                } else if (typeof product?.primary_image_url === 'string') {
                  images = [product.primary_image_url];
                } else if (typeof product?.image === 'string') {
                  images = [product.image];
                }
                const mainImage = images[selectedImage] || '/placeholder.png';
                return (
                  <img
                    key={mainImage}
                    src={imgError ? '/placeholder.png' : mainImage}
                    alt={product?.name || 'Product'}
                    className="w-full h-full object-contain rounded bg-gray-100 transition-transform duration-300 ease-in-out hover:scale-125 cursor-zoom-in"
                    onError={() => {
                      if (!imgError) setImgError(true);
                    }}
                    onClick={() => {
                      if (!imgError && mainImage !== '/placeholder.png') setShowImageModal(true);
                    }}
                    style={{ cursor: imgError ? 'default' : 'zoom-in' }}
                  />
                );
              })()}
              {/* Modal for full image view */}
              {showImageModal && (() => {
                let images: string[] = [];
                if (Array.isArray(product?.imagesArray) && product.imagesArray.length > 0) {
                  images = product.imagesArray.map((img: any) => img.image_url).filter((url: string) => !!url);
                } else if (Array.isArray(product?.images) && product.images.length > 0) {
                  images = product.images.filter((url: string) => !!url);
                } else if (typeof product?.primary_image_url === 'string') {
                  images = [product.primary_image_url];
                } else if (typeof product?.image === 'string') {
                  images = [product.image];
                }
                const mainImage = images[selectedImage] || '/placeholder.png';
                return !imgError && mainImage !== '/placeholder.png' ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setShowImageModal(false)}>
                    <div className="relative max-w-3xl w-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                      <img
                        src={mainImage}
                        alt={product?.name || 'Product'}
                        className="max-h-[80vh] max-w-full object-contain rounded shadow-lg"
                      />
                      <button
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
                        onClick={() => setShowImageModal(false)}
                        aria-label="Close full image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
            {/* Thumbnails */}
            {(() => {
              let images: string[] = [];
              if (Array.isArray(product?.imagesArray) && product.imagesArray.length > 0) {
                images = product.imagesArray.map((img: any) => img.image_url).filter((url: string) => !!url);
              } else if (Array.isArray(product?.images) && product.images.length > 0) {
                images = product.images.filter((url: string) => !!url);
              }
              return images.length > 1 ? (
                <div className="flex gap-2 mt-2">
                  {images.map((img, idx) => (
                    <img
                      key={`${img}-${idx}`}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-20 h-20 object-contain rounded border cursor-pointer transition ring-2 ${selectedImage === idx ? 'ring-yellow-400 border-yellow-400' : 'ring-transparent border-gray-200 hover:ring-yellow-300'}`}
                      onClick={() => {
                        setSelectedImage(idx);
                        setImgError(false);
                      }}
                    />
                  ))}
                </div>
              ) : null;
            })()}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            {/* Product Title and Price */}
            <h1 className="text-3xl font-bold mb-2 text-black">{product.name}</h1>
            {vendorName && (
              <div className="mb-2 text-sm text-gray-500">Sold by: <span className="font-medium text-black">{vendorName}</span></div>
            )}
            <div className="flex items-center mb-4">
              {/* No rating/review fields in new schema. */}
              <span className="text-2xl font-bold text-black ml-4">
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
                <span>Status: <b className="text-green-600">Available</b></span>
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
            {/* Cart & Wishlist Actions */}
            <WishlistCartActions
              productId={product.id}
              quantity={quantity}
              size={selectedSize}
              color={selectedColor}
            />

          </div>
        </div>
      </div>
      
      {/* Full Screen Review Section */}
      <section id="reviews" className="w-full bg-gradient-to-b from-white to-gray-50 py-16 ">
        <div className="w-full px-0 md:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Reviews</h2>
            {/* Reviews List */}
            {reviewLoading ? (
              <div className="text-center text-gray-400 mb-6">Loading reviews...</div>
            ) : reviewError ? (
              <div className="text-center text-red-500 mb-6">{reviewError}</div>
            ) : (
              <>
                {/* Review Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 p-6 bg-gray-50 rounded-xl shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-gray-900">{reviews.length}</span>
                    <span className="text-gray-500 font-medium text-sm">Total Reviews</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {(
                        reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
                      ).toFixed(1)}
                    </span>
                    <span className="flex items-center">
                      <span className="text-yellow-500 ml-1">
                        {'★'.repeat(Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)))}
                        {'☆'.repeat(5 - Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)))}
                      </span>
                    </span>
                    <span className="text-gray-500 font-medium text-sm">Average Rating</span>
                  </div>
                  {/* Rating Breakdown */}
                  <div className="w-full max-w-xs mt-8 md:mt-0">
                    {[5,4,3,2,1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const percent = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center mb-1">
                          <span className="text-xs w-6 text-right mr-1">{star}★</span>
                          <div className="flex-1 bg-gray-200 h-2 rounded">
                            <div className={`h-2 rounded bg-yellow-400`} style={{ width: `${percent}%` }} />
                          </div>
                          <span className="ml-2 text-xs text-gray-600 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Review List */}
                {reviews.length === 0 ? (
                  <div className="text-center text-gray-500 italic mb-6">No reviews yet. Be the first to review this product!</div>
                ) : (
                  <div className="space-y-8 mb-8">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-lg text-black">User #{review.user_id}</span>
                            <span className="text-yellow-500 text-base">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            {/* If review.date or created_at is available, show date */}
                            {review.created_at && (
                              <span className="text-xs text-gray-400 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="text-gray-800 whitespace-pre-line">{review.comment}</div>
                        </div>
                        {/* Future: Add actions like Public Comment, Direct Message, etc. */}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {/* Add Review Form */}
            <form
              className="bg-gray-50 rounded-lg p-6 flex flex-col gap-4"
              onSubmit={handleReviewSubmit}
            >
              <div>
                <label className="block font-medium mb-1">Rating <span className="text-red-500">*</span></label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  required
                >
                  <option value="">Select rating</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Review <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                  value={reviewContent}
                  onChange={e => setReviewContent(e.target.value)}
                  required
                  maxLength={500}
                  placeholder="Share your experience..."
                />
              </div>
              {reviewSubmitError && (
                <div className="text-red-500 text-sm">{reviewSubmitError}</div>
              )}
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition disabled:opacity-60"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? 'Submitting...' : 'Add a Review'}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Related Products */}
      <section className="container mx-auto px-4 py-12 border-t border-[#e8d8b9] mt-12">
        <h2 className="text-2xl font-bold text-black mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(allProducts) && allProducts.length > 0 ? (
            allProducts
              .filter((relatedProduct: ProductDetail) => {
                if (!relatedProduct.id || !product || relatedProduct.id === product.id) return false;
                // Parse tags for both products
                let currentTags: string[] = [];
                let compareTags: string[] = [];
                if (Array.isArray(product.tags)) {
                  currentTags = product.tags;
                } else if (typeof product.tags === 'string') {
                  try { currentTags = JSON.parse(product.tags.replace(/'/g, '"')); } catch { currentTags = []; }
                }
                if (Array.isArray(relatedProduct.tags)) {
                  compareTags = relatedProduct.tags;
                } else if (typeof relatedProduct.tags === 'string') {
                  try { compareTags = JSON.parse(relatedProduct.tags.replace(/'/g, '"')); } catch { compareTags = []; }
                }
                // Check for at least one common tag
                return currentTags.some(tag => compareTags.includes(tag));
              })
              .map((relatedProduct: ProductDetail) => {
                // Use already parsed fields
                const tags = Array.isArray(relatedProduct.tags) ? relatedProduct.tags : [];
                const sustainability = Array.isArray(relatedProduct.sustainability_attributes) ? relatedProduct.sustainability_attributes : [];
                const stock = typeof relatedProduct.stock_quantity === 'number' ? relatedProduct.stock_quantity : 'N/A';
                const minOrder = typeof relatedProduct.min_order_quantity === 'number' ? relatedProduct.min_order_quantity : 'N/A';
                console.log('[RELATED PRODUCT DEBUG]', {relatedProduct, tags, sustainability, stock, minOrder});
                return (
                  <Link href={`/shop/${relatedProduct.id}`} key={relatedProduct.id} className="group border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition-shadow block">
                    <div className="flex flex-col items-start">
                      <div className="w-full flex justify-center mb-2">
                        <img
                          src={relatedProduct.primary_image_url || relatedProduct.image || '/placeholder.png'}
                          alt={relatedProduct.name || 'Product'}
                          className="w-24 h-24 object-contain bg-gray-100 rounded mb-2"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.src !== window.location.origin + '/placeholder.png' && !img.src.endsWith('/placeholder.png')) {
                              img.src = '/placeholder.png';
                            }
                          }}
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
                        <span className="text-green-600 text-xs">
                          Available
                        </span>
                      </div>
                      <div className="text-xs mt-2">Stock: <b>{stock !== undefined && stock !== null ? stock : 'N/A'}</b></div>
                      <div className="text-xs">Min Order: <b>{minOrder !== undefined && minOrder !== null ? minOrder : 'N/A'}</b></div>
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
