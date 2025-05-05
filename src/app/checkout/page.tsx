"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartController, { CartItem, CartSummary } from "../controllers/cartController";
import Image from "next/image";

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCartItems(CartController.getItems());
    setSummary(CartController.getCartSummary());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Basic validation
    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city || !shipping.postalCode) {
      setError("Please fill in all shipping details.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setPlacingOrder(true);
    // Simulate API call
    setTimeout(() => {
      setOrderPlaced(true);
      CartController.clearCart();
      setPlacingOrder(false);
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Thank you for your order!</h2>
          <p className="mb-4">Your order has been placed successfully. We will contact you soon.</p>
          <button
            className="mt-4 px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-900"
            onClick={() => router.push("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Shipping Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={shipping.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shipping.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                  required
                />
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul className="divide-y divide-gray-200 mb-4">
                  {cartItems.map((item) => (
                    <li key={item.id+item.size+item.color} className="flex items-center py-3">
                      <div className="w-16 h-16 relative mr-4">
                        <Image src={item.image} alt={item.name} fill className="object-cover rounded-md" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ''}{item.color ? ` | Color: ${item.color}` : ''}</div>
                      </div>
                      <div className="font-semibold text-gray-900 ml-2">
                        {(item.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* Summary */}
              {summary && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{summary.subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{summary.shipping > 0 ? summary.shipping.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }) : 'Free'}</span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{summary.discount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{summary.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={placingOrder || cartItems.length === 0}
              className={`w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors ${placingOrder || cartItems.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
            {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
