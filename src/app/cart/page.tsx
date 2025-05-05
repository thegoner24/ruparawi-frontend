"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCart, updateCartItem, deleteCartItem } from "./api";

// Define cart item type
interface CartItem {
  product: {
    name: string;
    price: number;
    image: string;
    // add more fields if needed
  };
  product_id: number;
  quantity: number;
  // size?: string;
  // color?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load cart items from backend on component mount
  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      try {
        const data = await fetchCart();
        console.log('Cart page fetchCart response:', data);
        setCartItems(data.cart_items || []);
        setSubtotal(data.subtotal || 0);
        setShipping(data.shipping || 0);
        setDiscount(data.discount || 0);
        setTotal(data.total || 0);
      } catch (err) {
        // Optionally handle error
        setCartItems([]);
        setSubtotal(0);
        setShipping(0);
        setDiscount(0);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  // Handle quantity changes using backend API
  const updateQuantity = async (product_id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const item = cartItems.find(item => item.product_id === product_id);
      if (!item) return;
      await updateCartItem(product_id, { quantity: newQuantity });
      // Reload cart after update
      const data = await fetchCart();
      console.log('Cart page fetchCart after updateQuantity:', data);
      setCartItems(data.cart_items || []);
      setSubtotal(data.subtotal || 0);
      setShipping(data.shipping || 0);
      setDiscount(data.discount || 0);
      setTotal(data.total || 0);
    } catch (err) {
      // Optionally handle error
    }
  };
  
  // Remove item from cart using backend API
  const removeItem = async (product_id: number) => {
    try {
      await deleteCartItem(product_id);
      // Reload cart after remove
      const data = await fetchCart();
      console.log('Cart page fetchCart after removeItem:', data);
      setCartItems(data.cart_items || []);
      setSubtotal(data.subtotal || 0);
      setShipping(data.shipping || 0);
      setDiscount(data.discount || 0);
      setTotal(data.total || 0);
    } catch (err) {
      // Optionally handle error
    }
  };
  
  // Promo code currently not supported by backend API
  const applyPromoCode = () => {
    alert("Promo code feature is not available at the moment.");
  };
  
  console.log('Cart items structure:', cartItems);
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-black mb-8">Shopping Cart</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <svg className="animate-spin h-10 w-10 text-[#d4b572] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-gray-500 text-lg">Loading your cart...</span>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg">
                {/* Cart header */}
                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-[#e8d8b9] pb-4 mb-4">
                  <div className="col-span-6">
                    <h2 className="text-sm font-medium text-gray-500">Product</h2>
                  </div>
                  <div className="col-span-2 text-center">
                    <h2 className="text-sm font-medium text-gray-500">Price</h2>
                  </div>
                  <div className="col-span-2 text-center">
                    <h2 className="text-sm font-medium text-gray-500">Quantity</h2>
                  </div>
                  <div className="col-span-2 text-right">
                    <h2 className="text-sm font-medium text-gray-500">Total</h2>
                  </div>
                </div>
                
                {/* Cart items */}
                {cartItems.map((item, idx) => (
  <div key={item.product_id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200">
    {/* Product info */}
    <div className="col-span-6 flex">
      <div className="w-24 h-24 bg-[#f8f5f0] rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.product?.image || "/placeholder.png"} 
          alt={item.product?.name || "Product"} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="ml-4 flex flex-col">
        <h3 className="text-base font-medium text-gray-900">{item.product?.name || "No name"}</h3>
        <button 
          onClick={() => removeItem(item.product_id)}
          className="text-sm text-gray-500 hover:text-black mt-auto flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
    {/* Price */}
    <div className="col-span-2 flex md:block items-center">
      <span className="text-sm md:hidden font-medium text-gray-500 mr-2">Price:</span>
      <span className="text-sm font-medium text-gray-900">
        {item.product?.price ? item.product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }) : 'N/A'}
      </span>
    </div>
    {/* Quantity */}
    <div className="col-span-2 flex items-center">
      <span className="text-sm md:hidden font-medium text-gray-500 mr-2">Quantity:</span>
      <div className="flex items-center border border-gray-300 rounded-md">
        <button 
          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          className="px-3 py-1 text-gray-600 hover:text-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
          className="px-3 py-1 text-gray-600 hover:text-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
    {/* Total */}
    <div className="col-span-2 flex md:block items-center justify-between">
      <span className="text-sm md:hidden font-medium text-gray-500">Total:</span>
      <span className="text-sm font-bold text-gray-900">
        {(item.product?.price && item.quantity) ? (item.product.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }) : 'N/A'}
      </span>
    </div>
  </div>
))}
                
                {/* Continue shopping */}
                <div className="mt-6">
                  <Link href="/shop" className="text-[#d4b572] hover:text-black transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#f8f5f0] rounded-lg p-6 border border-[#e8d8b9]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      {subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {shipping.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-[#d4b572]">
                      <span>Discount</span>
                      <span>
                        -{discount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-[#e8d8b9] pt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Promo code */}
                <div className="mb-6">
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572] focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                      className={`px-4 py-2 rounded-md ${
                        promoApplied
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-[#d4b572] mt-1">Promo code applied successfully!</p>
                  )}
                </div>
                
                {/* Checkout button */}
                <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors mb-4">
                  Proceed to Checkout
                </button>
                
                {/* Secure checkout */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
