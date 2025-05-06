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

export async function addPaymentMethod(method: Partial<PaymentMethod>): Promise<PaymentMethod> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/user/me/payment-methods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
  payment_type: method.payment_type,
  provider: method.provider,
  account_number: method.account_number,
  expiry_date: method.expiry_date,
  is_default: method.is_default
}),
  });
  if (!res.ok) throw new Error("Failed to add payment method");
  return res.json();
}

export async function deletePaymentMethod(payment_id: number): Promise<void> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/user/me/payment-methods/${payment_id}`, {
    method: "DELETE",
    credentials: "include",
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to delete payment method");
}

export async function updatePaymentMethod(payment_id: number, method: Partial<PaymentMethod>): Promise<PaymentMethod> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/user/me/payment-methods/${payment_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
  payment_type: method.payment_type,
  provider: method.provider,
  account_number: method.account_number,
  expiry_date: method.expiry_date,
  is_default: method.is_default
}),
  });
  if (!res.ok) throw new Error("Failed to update payment method");
  return res.json();
}
