import { API_BASE_URL, AuthController } from "../controllers/authController";

export async function fetchCart() {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/order/cart`, {
    credentials: "include",
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addCartItem(item: {
  product_id: number | string;
  quantity: number;
  size?: string;
  color?: string;
}) {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/order/cart/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add item to cart");
  return res.json();
}

export async function updateCartItem(product_id: number | string, data: {
  quantity: number;
  size?: string;
  color?: string;
}) {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/order/cart/item/${product_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

export async function deleteCartItem(product_id: number | string) {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/order/cart/item/${product_id}`, {
    method: "DELETE",
    credentials: "include",
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to delete cart item");
  return res.json();
}
