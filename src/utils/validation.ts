/**
 * Utility functions for form validation
 */

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password meets minimum requirements
 * @param password - The password to validate
 * @returns Boolean indicating if the password is valid
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, containing at least one number and one letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Simple regex for Indonesian phone numbers
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates required fields are not empty
 * @param value - The value to check
 * @returns Boolean indicating if the value is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates a value is within a specified length range
 * @param value - The value to check
 * @param min - Minimum length (inclusive)
 * @param max - Maximum length (inclusive)
 * @returns Boolean indicating if the value is within range
 */
export function isWithinLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}
