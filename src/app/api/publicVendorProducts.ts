// API for fetching public vendor products by business_name
const API_BASE_URL = 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';

export async function fetchPublicVendorProducts(businessName: string) {
  const url = `${API_BASE_URL}/products/public-vendor-products?business_name=${encodeURIComponent(businessName)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch vendor products');
  const data = await res.json();
  return data?.data?.products || [];
}
