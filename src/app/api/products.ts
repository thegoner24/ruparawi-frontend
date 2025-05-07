// API utility for fetching products
export async function fetchProducts() {
  // You may want to move API_BASE_URL to a config file or import if already defined elsewhere
  const API_BASE_URL = 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
}
