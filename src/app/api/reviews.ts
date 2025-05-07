// API utility functions for product reviews

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';

export interface Review {
  comment: string;
  product_id: number;
  rating: number;
  user_id: number;
  [property: string]: any;
}

// Fetch reviews for a product
export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/review/product/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return await res.json();
}

// Add a review
export async function addProductReview({ product_id, rating, comment, user_id }: { product_id: number; rating: number; comment: string; user_id: number }): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({ product_id, rating, comment, user_id }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return await res.json();
}
