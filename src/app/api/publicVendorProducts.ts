// API for fetching public vendor products by business_name
const API_BASE_URL = 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';

export async function fetchPublicVendorProducts(businessName: string) {
  const url = `${API_BASE_URL}/products/public-vendor-products?business_name=${encodeURIComponent(businessName)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    console.log('[fetchPublicVendorProducts] URL:', url, 'Status:', res.status);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error('[fetchPublicVendorProducts] Failed to parse JSON:', text);
      throw new Error('Invalid JSON response');
    }
    console.log('[fetchPublicVendorProducts] Response data:', data);
    if (!res.ok) throw new Error('Failed to fetch vendor products');
    return data?.products || [];
  } catch (err) {
    console.error('[fetchPublicVendorProducts] Error:', err);
    throw err;
  }
}
