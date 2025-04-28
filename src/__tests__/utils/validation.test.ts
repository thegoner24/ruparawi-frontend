import { 
  isValidEmail, 
  isValidPassword, 
  isValidPhone, 
  isNotEmpty, 
  isWithinLength 
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('validates correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.id')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user example.com')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('validates passwords meeting requirements', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('Pass1234')).toBe(true);
      expect(isValidPassword('abcd1234')).toBe(true);
    });

    it('rejects passwords not meeting requirements', () => {
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword('pass')).toBe(false); // too short
      expect(isValidPassword('password')).toBe(false); // no numbers
      expect(isValidPassword('12345678')).toBe(false); // no letters
      expect(isValidPassword('pass 123')).toBe(false); // has space
    });
  });

  describe('isValidPhone', () => {
    it('validates correct Indonesian phone numbers', () => {
      expect(isValidPhone('081234567890')).toBe(true);
      expect(isValidPhone('08123456789')).toBe(true);
      expect(isValidPhone('+6281234567890')).toBe(true);
      expect(isValidPhone('6281234567890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('0812345')).toBe(false); // too short
      expect(isValidPhone('021234567890')).toBe(false); // wrong prefix
      expect(isValidPhone('phone')).toBe(false); // not a number
    });
  });

  describe('isNotEmpty', () => {
    it('validates non-empty strings', () => {
      expect(isNotEmpty('text')).toBe(true);
      expect(isNotEmpty(' text with spaces ')).toBe(true);
    });

    it('rejects empty strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false); // only whitespace
    });
  });

  describe('isWithinLength', () => {
    it('validates strings within length range', () => {
      expect(isWithinLength('text', 1, 10)).toBe(true);
      expect(isWithinLength('text', 4, 4)).toBe(true); // exact length
      expect(isWithinLength(' text ', 1, 10)).toBe(true); // trims whitespace
    });

    it('rejects strings outside length range', () => {
      expect(isWithinLength('', 1, 10)).toBe(false); // too short
      expect(isWithinLength('text', 5, 10)).toBe(false); // too short
      expect(isWithinLength('long text here', 1, 10)).toBe(false); // too long
    });
  });
});
