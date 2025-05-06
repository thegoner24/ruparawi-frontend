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
import { getActivePromotionByCode, getPromotions } from "@/app/controllers/promotionController";
import { AuthController } from "@/app/controllers/authController";

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
  const [promoStatus, setPromoStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle');
  const [promoDetails, setPromoDetails] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [availablePromotions, setAvailablePromotions] = useState<any[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  // Address add form state
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    city: '',
    state: '',
    country: 'Indonesia',
    postal_code: '',
    is_default: false,
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
    // Fetch available promotions
    async function loadPromotions() {
      setLoadingPromotions(true);
      try {
        const token = await AuthController.getToken();
        const promos = await getPromotions(token);
        setAvailablePromotions(promos ?? []);
      } catch (e) {
        setAvailablePromotions([]);
      } finally {
        setLoadingPromotions(false);
      }
    }
    loadPromotions();
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
    const { name, type, value, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setAddressSuccess('');
    setAddingAddress(true);
    try {
      // Required: address_line1, city, state, country, postal_code
      const { address_line1, city, state, country, postal_code } = newAddress;
      if (!address_line1 || !city || !state || !country || !postal_code) {
        setAddressError('Please fill in all required fields.');
        setAddingAddress(false);
        return;
      }
      const added = await addUserAddress(newAddress);
      // Refresh addresses
      const updated = await fetchUserAddresses();
      setAddresses(updated);
      setShippingAddressId(added.id);
      setBillingAddressId(added.id);
      setNewAddress({ address_line1: '', city: '', state: '', country: 'Indonesia', postal_code: '', is_default: false });
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

  // Promo code validation
  const handlePromoCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPromotionCode(value);
    setPromoDetails(null);
    setPromoError(null);
    if (!value) {
      setPromoStatus('idle');
      return;
    }
    setPromoStatus('checking');
    try {
      const token = AuthController.getToken();
      if (!token) {
        setPromoStatus('invalid');
        setPromoError('You must be logged in to use a promo code.');
        return;
      }
      const promo = await getActivePromotionByCode(value, token);
      if (promo) {
        setPromoDetails(promo);
        setPromoStatus('valid');
        setPromoError(null);
        // Optionally update summary discount here
        setSummary((prev) => prev ? {
          ...prev,
          discount: promo.promo_discount ?? promo.discount ?? 0,
          total: prev.subtotal + prev.shipping - (promo.promo_discount ?? promo.discount ?? 0)
        } : prev);
      } else {
        setPromoStatus('invalid');
        setPromoDetails(null);
        setPromoError('Invalid or expired promo code.');
        // Optionally reset discount
        setSummary((prev) => prev ? {
          ...prev,
          discount: 0,
          total: prev.subtotal + prev.shipping
        } : prev);
      }
    } catch (err: any) {
      setPromoStatus('invalid');
      setPromoDetails(null);
      setPromoError('Error checking promo code.');
      setSummary((prev) => prev ? {
        ...prev,
        discount: 0,
        total: prev.subtotal + prev.shipping
      } : prev);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Basic validation
    if (!shippingAddressId || !billingAddressId || !paymentMethodId || !notes) {
      setError("Please fill in all required fields.");
      return;
    }
    if (promotionCode && promoStatus !== 'valid') {
      setError("Please enter a valid promo code or remove the invalid code.");
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
              <div className="max-w-lg mx-auto bg-white/80 border border-yellow-300 shadow-xl rounded-2xl p-8 animate-fade-in">
                <div className="flex flex-col items-center mb-6">
                  <svg className="w-10 h-10 text-[#d4b572] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 01-8 0m8 0V9a4 4 0 00-8 0v3m8 0a4 4 0 01-8 0" /></svg>
                  <h2 className="text-xl font-bold text-[#b49a4d] mb-1">Add Delivery Address</h2>
                  <p className="text-gray-700 text-sm text-center">No addresses found. Please add an address to continue checkout.</p>
                </div>
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <input type="text" name="address_line1" id="address_line1" value={newAddress.address_line1} onChange={handleNewAddressChange} required className="peer w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d4b572] transition-all" placeholder="Street Address" />
                    <label htmlFor="address_line1" className="absolute left-4 top-3 text-gray-500 text-xs peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#d4b572] peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs transition-all bg-white px-1">Street Address <span className="text-red-500">*</span></label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" name="city" id="city" value={newAddress.city} onChange={handleNewAddressChange} required className="peer w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d4b572] transition-all" placeholder="City" />
                      <label htmlFor="city" className="absolute left-4 top-3 text-gray-500 text-xs peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#d4b572] peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs transition-all bg-white px-1">City <span className="text-red-500">*</span></label>
                    </div>
                    <div className="relative">
                      <input type="text" name="state" id="state" value={newAddress.state} onChange={handleNewAddressChange} required className="peer w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d4b572] transition-all" placeholder="State/Province" />
                      <label htmlFor="state" className="absolute left-4 top-3 text-gray-500 text-xs peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#d4b572] peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs transition-all bg-white px-1">State/Province <span className="text-red-500">*</span></label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" name="postal_code" id="postal_code" value={newAddress.postal_code} onChange={handleNewAddressChange} required className="peer w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d4b572] transition-all" placeholder="Postal Code" />
                      <label htmlFor="postal_code" className="absolute left-4 top-3 text-gray-500 text-xs peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#d4b572] peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs transition-all bg-white px-1">Postal Code <span className="text-red-500">*</span></label>
                    </div>
                    <div className="relative">
                      <input type="text" name="country" id="country" value={newAddress.country} onChange={handleNewAddressChange} required className="peer w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#d4b572] transition-all" placeholder="Country" />
                      <label htmlFor="country" className="absolute left-4 top-3 text-gray-500 text-xs peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#d4b572] peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs transition-all bg-white px-1">Country <span className="text-red-500">*</span></label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" name="is_default" id="is_default" checked={newAddress.is_default} onChange={handleNewAddressChange} className="h-4 w-4 text-[#d4b572] border-gray-300 rounded focus:ring-[#d4b572]" />
                    <label htmlFor="is_default" className="text-sm text-gray-700">Set as default address</label>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-[#d4b572] to-[#b49a4d] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:from-[#b49a4d] hover:to-[#d4b572] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={addingAddress}>
                    {addingAddress ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Address
                      </>
                    )}
                  </button>
                  {addressError && <p className="text-red-600 text-sm mt-1 animate-fade-in-fast">{addressError}</p>}
                  {addressSuccess && <p className="text-green-600 text-sm mt-1 animate-fade-in-fast">{addressSuccess}</p>}
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
                    {/* Promo Code Input & Feedback */}
                    <div className="mb-4">
  <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
  <div className="flex items-center space-x-2">
    <input
      id="promo-code"
      type="text"
      value={promotionCode}
      onChange={handlePromoCodeChange}
      className="border border-gray-300 rounded-md px-3 py-2 flex-1"
      placeholder="Enter promo code"
      autoComplete="off"
    />
    <select
      className="border border-gray-300 rounded-md px-2 py-2 bg-white text-sm"
      onChange={e => {
        const selected = availablePromotions.find(p => (p.promo_code || p.code || '').toLowerCase() === e.target.value.toLowerCase());
        if (selected) {
          setPromotionCode(selected.promo_code || selected.code || '');
        }
      }}
      value=""
      disabled={loadingPromotions || availablePromotions.length === 0}
      style={{ minWidth: 160 }}
    >
      <option value="">{loadingPromotions ? 'Loading...' : 'Select Promotion'}</option>
      {availablePromotions.map(promo => (
        <option key={promo.id} value={promo.promo_code || promo.code || ''}>
          {(promo.promo_description || promo.description || promo.title) +
            (promo.promo_discount || promo.discount ?
              ` - ${(promo.promo_discount ?? promo.discount ?? 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}` :
              '')}
        </option>
      ))}
    </select>
    {promoStatus === 'checking' && <span className="text-gray-500 text-xs">Checking...</span>}
    {promoStatus === 'valid' && <span className="text-green-600 text-xs">Valid!</span>}
    {promoStatus === 'invalid' && <span className="text-red-600 text-xs">Invalid</span>}
  </div>
  {promoDetails && (
    <div className="mt-2 text-green-700 text-xs">
      <div><b>Promo:</b> {promoDetails.promo_description || promoDetails.description}</div>
      <div><b>Discount:</b> {(promoDetails.promo_discount ?? promoDetails.discount ?? 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</div>
    </div>
  )}
  {promoError && <div className="mt-2 text-red-600 text-xs">{promoError}</div>}
</div>
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
