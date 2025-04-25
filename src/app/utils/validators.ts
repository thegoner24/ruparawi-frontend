/**
 * Utility functions for validating form inputs and data
 */

/**
 * Validate an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password strength
 * @param password - The password to validate
 * @returns Object containing validation result and message
 */
export const validatePassword = (password: string): { 
  isValid: boolean; 
  message: string;
} => {
  if (password.length < 8) {
    return { 
      isValid: false, 
      message: 'Password must be at least 8 characters long' 
    };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }
  
  if (!/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one lowercase letter' 
    };
  }
  
  if (!/[0-9]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one number' 
    };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validate a phone number (Indonesian format)
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  // Indonesian phone number format: +62 or 0 followed by 9-12 digits
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate if a string is not empty
 * @param value - The string to validate
 * @returns True if the string is not empty, false otherwise
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate if two passwords match
 * @param password - The password
 * @param confirmPassword - The confirmation password
 * @returns True if the passwords match, false otherwise
 */
export const passwordsMatch = (
  password: string, 
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Validate a credit card number using Luhn algorithm
 * @param cardNumber - The credit card number to validate
 * @returns True if the card number is valid, false otherwise
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};
