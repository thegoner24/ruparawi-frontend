import { API_BASE_URL, AuthController } from "@/app/controllers/authController";

export interface PaymentMethod {
  id: number;
  payment_type: string;
  provider: string;
  account_number: string;
  expiry_date: string;
  is_default: boolean;
  [key: string]: any;
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/user/me/payment-methods`, {
    credentials: "include",
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to fetch payment methods");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.payment_methods || []);
}
