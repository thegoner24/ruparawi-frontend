import { API_BASE_URL, AuthController } from "@/app/controllers/authController";

export interface Address {
  id: number;
  label?: string;
  recipient_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  [key: string]: any;
}

export async function addUserAddress(address: Partial<Address>): Promise<Address> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/user/me/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error("Failed to add address");
  return res.json();
}

export async function fetchUserAddresses(): Promise<Address[]> {
  const token = AuthController.getToken?.() || null;
  const res = await fetch(`${API_BASE_URL}/user/me/address`, {
    credentials: "include",
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to fetch addresses");
  const data = await res.json();
  // assuming backend returns { addresses: [...] } or just an array
  return Array.isArray(data) ? data : (data.addresses || []);
}
