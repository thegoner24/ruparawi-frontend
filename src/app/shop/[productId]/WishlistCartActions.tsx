"use client";
import React, { useState } from "react";
import { addToWishlist, removeFromWishlist } from "../../controllers/wishlistController";
import { addCartItem, fetchCart } from "../../cart/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";


interface WishlistCartActionsProps {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

const WishlistCartActions: React.FC<WishlistCartActionsProps> = ({ productId, quantity, size, color }) => {
  const { token } = useAuth();
  const { refreshCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Improved error handler
  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  const handleAddToCart = async () => {
    if (!token) {
      showError("You must be logged in to add items to the cart.");
      return;
    }
    setLoading(true);
    try {
      await addCartItem({ product_id: productId, quantity, size, color });
      if (refreshCart) await refreshCart();
      showMessage("Item added to cart!");
    } catch (err: any) {
      if (err && err.message) {
        showError(err.message);
      } else {
        showError("Failed to add to cart. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleWishlist = async () => {
    if (!token) {
      showError("You must be logged in to use the wishlist.");
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId, token);
        setInWishlist(false);
        showMessage("Removed from wishlist");
      } else {
        await addToWishlist(productId, token);
        setInWishlist(true);
        showMessage("Added to wishlist");
      }
    } catch (err: any) {
      if (err && err.message) {
        showError(err.message);
      } else {
        showError("Wishlist action failed. Please check your connection.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-2 rounded text-center text-sm font-semibold" role="alert">{error}</div>
      )}
      {message && !error && (
        <div className="bg-green-100 text-green-700 p-2 mb-2 rounded text-center text-sm">{message}</div>
      )}
      <div className="mb-4">
        <button
          className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
      <button
        className={`w-full border border-[#e8d8b9] bg-white text-black py-3 rounded-md font-medium hover:bg-[#f8f5f0] transition-colors mb-6 flex items-center justify-center disabled:opacity-60 ${inWishlist ? 'bg-[#ffe4e6] border-[#fda4af]' : ''}`}
        onClick={handleWishlist}
        disabled={wishlistLoading}
      >
        <svg className="w-5 h-5 mr-2" fill={inWishlist ? "#f87171" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlistLoading ? (inWishlist ? "Removing..." : "Adding...") : (inWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
      </button>
    </div>
  );
};

export default WishlistCartActions;
