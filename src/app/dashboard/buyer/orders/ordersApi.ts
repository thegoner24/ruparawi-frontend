import { API_BASE_URL, AuthController } from "@/app/controllers/authController";

export interface Order {
  created_at: string;
  id: number;
  items: string;
  order_number: string;
  status: string;
  status_history: string;
  total_amount: number;
  [property: string]: any;
}

export async function fetchOrders(): Promise<Order[]> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/order`, {
    credentials: "include",
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return Array.isArray(data.orders) ? data.orders : [];
}
