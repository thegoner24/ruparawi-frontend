"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCart } from "../cart/api";
type CartItemAPI = {
  product: {
    name: string;
    price: number;
    image: string;
  };
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
};
import { checkoutOrder } from "../cart/api";
import { fetchUserAddresses, addUserAddress, Address } from "./addressApi";
import { fetchPaymentMethods, PaymentMethod } from "./paymentMethodsApi";
import Image from "next/image";

// Backend expects these params:
// shipping_address_id: integer (required)
// billing_address_id: integer (required)
// payment_method_id: integer (required)
// notes: string (required)
// promotion_code: string (optional)


export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItemAPI[]>([]);
  const [summary, setSummary] = useState<{subtotal:number, shipping:number, discount:number, total:number} | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [shippingAddressId, setShippingAddressId] = useState<number | ''>('');
  const [billingAddressId, setBillingAddressId] = useState<number | ''>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState<number | ''>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [notes, setNotes] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  // Address add form state
  const [newAddress, setNewAddress] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch payment methods
    setLoadingPaymentMethods(true);
    fetchPaymentMethods().then(methods => {
      setPaymentMethods(methods);
      if (methods.length > 0) setPaymentMethodId(methods[0].id);
      setLoadingPaymentMethods(false);
    }).catch(() => setLoadingPaymentMethods(false));
    // Fetch cart summary & items from API
    async function loadCartSummary() {
      setLoadingSummary(true);
      try {
        const data = await fetchCart();
        setCartItems(data.cart_items || []);
        // Compute subtotal, shipping, discount, total if not present
        const items = data.cart_items || [];
        const subtotal = items.reduce((sum: number, item: any) => sum + ((item.product?.price || 0) * (item.quantity || 0)), 0);
        const shipping = typeof data.shipping === 'number' ? data.shipping : 0;
        const discount = typeof data.discount === 'number' ? data.discount : 0;
        const total = typeof data.total === 'number' ? data.total : (subtotal + shipping - discount);
        setSummary({
          subtotal: typeof data.subtotal === 'number' ? data.subtotal : subtotal,
          shipping,
          discount,
          total
        });
      } catch (err) {
        setCartItems([]);
        setSummary({ subtotal: 0, shipping: 0, discount: 0, total: 0 });
      } finally {
        setLoadingSummary(false);
      }
    }
    loadCartSummary();
    // Fetch addresses
    setLoadingAddresses(true);
    fetchUserAddresses().then(addresses => {
      setAddresses(addresses);
      if (addresses.length > 0) {
        setShippingAddressId(addresses[0].id);
        setBillingAddressId(addresses[0].id);
      }
      setLoadingAddresses(false);
    }).catch((err) => {
      setAddressError('Failed to fetch addresses');
    }).finally(() => {
      setLoadingAddresses(false);
    });
  }, []);

  // Add new address handler
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setAddressSuccess('');
    setAddingAddress(true);
    try {
      // Required: label, recipient_name, phone, address, city, postal_code
      const { label, recipient_name, phone, address, city, postal_code } = newAddress;
      if (!label || !recipient_name || !phone || !address || !city || !postal_code) {
        setAddressError('Please fill in all address fields.');
        setAddingAddress(false);
        return;
      }
      const added = await addUserAddress(newAddress);
      // Refresh addresses
      const updated = await fetchUserAddresses();
      setAddresses(updated);
      setShippingAddressId(added.id);
      setBillingAddressId(added.id);
      setNewAddress({ label: '', recipient_name: '', phone: '', address: '', city: '', postal_code: '' });
      setAddressSuccess('Address added successfully!');
    } catch (err: any) {
      setAddressError(err?.message || 'Failed to add address.');
    } finally {
      setAddingAddress(false);
    }
  };


  // For numeric fields
  const handleNumberChange = (setter: (v: number | '') => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setter(val === '' ? '' : Number(val));
  };
  // For text fields
  const handleTextChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Basic validation
    if (!shippingAddressId || !billingAddressId || !paymentMethodId || !notes) {
      setError("Please fill in all required fields.");
      return;
    }
    setPlacingOrder(true);
    try {
      const payload = {
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        payment_method_id: paymentMethodId,
        notes,
        ...(promotionCode ? { promotion_code: promotionCode } : {}),
      };
      await checkoutOrder(payload);
      setOrderPlaced(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
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
        {loadingAddresses ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-lg text-gray-600 animate-pulse">Loading addresses...</div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>
            {addresses.length === 0 ? (
              <div className="max-w-lg mx-auto bg-yellow-50 border border-yellow-200 p-6 rounded shadow">
                <p className="mb-4 text-yellow-700 font-medium text-center">No addresses found. Please add an address to continue checkout.</p>
                <form onSubmit={handleAddAddress} className="space-y-2">
                  <input type="text" name="label" placeholder="Label (e.g. Home, Office)" value={newAddress.label} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                  <input type="text" name="recipient_name" placeholder="Recipient Name" value={newAddress.recipient_name} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                  <input type="text" name="phone" placeholder="Phone" value={newAddress.phone} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                  <input type="text" name="address" placeholder="Address" value={newAddress.address} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                  <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                  <input type="text" name="postal_code" placeholder="Postal Code" value={newAddress.postal_code} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
                  <button type="submit" className="w-full bg-[#d4b572] text-white py-2 rounded-md font-medium hover:bg-[#b49a4d] transition-colors" disabled={addingAddress}>
                    {addingAddress ? 'Adding...' : 'Add Address'}
                  </button>
                  {addressError && <p className="text-red-600 text-sm mt-1">{addressError}</p>}
                  {addressSuccess && <p className="text-green-600 text-sm mt-1">{addressSuccess}</p>}
                </form>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Checkout Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Address</label>
                  <select
                    name="shipping_address_id"
                    value={shippingAddressId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShippingAddressId(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                    required
                  >
                    <option value="" disabled>Select address</option>
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {`${addr.label || addr.recipient_name || addr.address || addr.city || ''}${addr.city && (addr.label || addr.recipient_name || addr.address) ? ' - ' + addr.city : ''}`.replace(/^\s*-\s*/, '')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Billing Address</label>
                  <select
                    name="billing_address_id"
                    value={billingAddressId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBillingAddressId(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                    required
                  >
                    <option value="" disabled>Select address</option>
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {`${addr.label || addr.recipient_name || addr.address || addr.city || ''}${addr.city && (addr.label || addr.recipient_name || addr.address) ? ' - ' + addr.city : ''}`.replace(/^\s*-\s*/, '')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method ID</label>
                  <input
                    type="number"
                    name="payment_method_id"
                    value={paymentMethodId}
                    onChange={handleNumberChange(setPaymentMethodId)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={handleTextChange(setNotes)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Promotion Code (optional)</label>
                  <input
                    type="text"
                    name="promotion_code"
                    value={promotionCode}
                    onChange={handleTextChange(setPromotionCode)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
                  />
                </div>
                {/* Payment Method Selection */}
                <div className="md:col-span-2">
                  <label className="block font-medium mb-2">Payment Method</label>
                  {loadingPaymentMethods ? (
                    <div className="text-gray-500">Loading payment methods...</div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-gray-500">No payment methods found. Please add one in your dashboard.</div>
                  ) : (
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                      value={paymentMethodId}
                      onChange={e => setPaymentMethodId(Number(e.target.value))}
                      required
                    >
                      {paymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.payment_type} - {method.provider} ••••{method.account_number.slice(-4)}{method.is_default ? ' (Default)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* Order Summary */}
                <div className="md:col-span-2 mt-8">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    {loadingSummary ? (
                      <div className="text-gray-600 animate-pulse">Loading order summary...</div>
                    ) : cartItems.length === 0 ? (
                      <p>Your cart is empty.</p>
                    ) : (
                      <ul className="divide-y divide-gray-200 mb-4">
                        {cartItems.map((item) => (
                          <li key={item.product_id} className="flex items-center py-3">
                            <div className="w-16 h-16 relative mr-4">
                              {item.product.image ? (
                                <Image src={item.product.image} alt={item.product.name} fill className="object-cover rounded-md" />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">No Image</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.product.name}</div>
                              <div className="text-sm text-gray-500">Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ''}{item.color ? ` | Color: ${item.color}` : ''}</div>
                            </div>
                            <div className="font-semibold text-gray-900 ml-2">
                              {(item.product.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Summary */}
                    {summary && !loadingSummary && (
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
                </div>
                <button
                  type="submit"
                  disabled={placingOrder || cartItems.length === 0 || !paymentMethodId}
                  className={`w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors ${placingOrder || cartItems.length === 0 || !paymentMethodId ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
                {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
