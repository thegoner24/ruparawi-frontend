import { API_BASE_URL } from "@/app/controllers/authController";
import type { Address } from "@/app/dashboard/buyer/address/AddressCard";

export async function getUserAddresses(token: string) {
  const res = await fetch(`${API_BASE_URL}/user/me/address`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch addresses');
  }
  return res.json();
}

export async function createUserAddress(address: Partial<Address>, token: string) {
  const res = await fetch(`${API_BASE_URL}/user/me/address`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) {
    throw new Error('Failed to create address');
  }
  return res.json();
}

export async function updateUserAddress(addressId: number, address: Partial<Address>, token: string) {
  const res = await fetch(`${API_BASE_URL}/user/me/address/${addressId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) {
    throw new Error('Failed to update address');
  }
  return res.json();
}

export async function deleteUserAddress(addressId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/user/me/address/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete address');
  }
  return res.json();
}
