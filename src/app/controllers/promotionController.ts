import { API_BASE_URL } from "@/app/controllers/authController";

export interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: number;
  start_date: string;
  end_date: string;
  [key: string]: any;
}

export async function getPromotions(token: string): Promise<Promotion[]> {
  const res = await fetch(`${API_BASE_URL}/admin/promotions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch promotions");
  const data = await res.json();
  return Array.isArray(data.promotions) ? data.promotions : data.promotions || [];
}

export async function createPromotion(promotion: Partial<Promotion>, token: string): Promise<Promotion> {
  const res = await fetch(`${API_BASE_URL}/admin/promotions`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promotion),
  });
  if (!res.ok) throw new Error("Failed to create promotion");
  return await res.json();
}

export async function updatePromotion(id: number, promotion: Partial<Promotion>, token: string): Promise<Promotion> {
  const res = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promotion),
  });
  if (!res.ok) throw new Error("Failed to update promotion");
  return await res.json();
}
