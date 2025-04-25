/**
 * Utility functions for formatting data across the application
 */

/**
 * Format a price in IDR currency format
 * @param price - The price to format in IDR (stored as integer, e.g., 100000)
 * @returns Formatted price string (e.g., "Rp 100.000")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format a date to a human-readable string
 * @param date - The date to format (ISO string or Date object)
 * @returns Formatted date string (e.g., "25 April 2025")
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Truncate a string to a specified length and add ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Star types for rating display
 */
export type StarType = 'full' | 'half' | 'empty';

/**
 * Convert a rating (0-5) to an array of star types
 * @param rating - The rating value (0-5)
 * @returns Array of star types ('full', 'half', or 'empty')
 */
export const ratingToStars = (rating: number): StarType[] => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return Array(5).fill('empty').map((_, index) => {
    if (index < fullStars) return 'full';
    if (index === fullStars && hasHalfStar) return 'half';
    return 'empty';
  });
};

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage as a string (e.g., "20%")
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number
): string => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return '0%';
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(discount)}%`;
};
