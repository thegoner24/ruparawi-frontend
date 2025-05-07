import AuthController, { API_BASE_URL } from "@/app/controllers/authController";

export interface Promotion {
  discount_value: number;
  end_date: string;
  id: number;
  image_url: string;
  is_active: boolean;
  max_discount: number;
  products: string;
  promo_code: string;
  promotion_type: string;
  start_date: string;
  title: string;
  usage_limit: number;
  [property: string]: any;
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

/**
 * Fetch a promotion by code and check if it's active (date, usage, etc).
 * Returns the promotion object or null if not found/active.
 */
// Public: fetch all available promotions (no auth required)
export async function getPublicPromotions(): Promise<Promotion[]> {
  const token = await AuthController.getToken?.();
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/products/promotions`, { headers });
  if (!res.ok) throw new Error("Failed to fetch public promotions");
  const data = await res.json();
  return Array.isArray(data.promotions) ? data.promotions : data.promotions || [];
}

// Pre-checkout calculation: POST /order/pre-checkout
export async function preCheckoutCalculation(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/order/pre-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: `Bearer ${AuthController.getToken?.()}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to calculate pre-checkout");
  return await res.json();
}

export async function getActivePromotionByCode(code: string, token: string): Promise<Promotion | null> {
  const promotions = await getPromotions(token);
  const now = new Date();
  const found = promotions.find(promo =>
    (promo.promo_code || promo.code || '').toLowerCase() === code.toLowerCase()
  );
  if (!found) return null;
  // Date check
  const start = found.start_date ? new Date(found.start_date) : null;
  const end = found.end_date ? new Date(found.end_date) : null;
  if ((start && now < start) || (end && now > end)) return null;
  // Usage limit check (if present)
  if (found.usage_limit && found.usage_count && found.usage_count >= found.usage_limit) return null;
  return found;
}

