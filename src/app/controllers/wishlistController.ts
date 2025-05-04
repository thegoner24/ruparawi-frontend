import { API_BASE_URL } from './authController';

export async function getWishlist(token: string) {
  const res = await fetch(`${API_BASE_URL}/products/wishlist`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  return res.json();
}

export async function addToWishlist(productId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/products/wishlist/${productId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to add product to wishlist');
  }
  return res.json();
}

export async function removeFromWishlist(productId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/products/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to remove product from wishlist');
  }
  return res.json();
}
