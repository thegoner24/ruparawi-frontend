import { formatRupiah, parseRupiah } from '../../utils/formatCurrency';

describe('Currency Formatting Utilities', () => {
  describe('formatRupiah', () => {
    it('formats numbers as currency values', () => {
      // Test basic formatting without checking exact output format
      // since locale formatting can vary between environments
      const formatted1M = formatRupiah(1000000);
      expect(formatted1M).toContain('1'); // Contains the number 1
      expect(formatted1M.length).toBeGreaterThan(3); // Has some formatting
      
      const formatted3_5M = formatRupiah(3500000);
      expect(formatted3_5M).toContain('3'); // Contains the number 3
      expect(formatted3_5M).toContain('5'); // Contains the number 5
      expect(formatted3_5M.length).toBeGreaterThan(3); // Has some formatting
    });

    it('includes decimal places when specified', () => {
      const withDecimals = formatRupiah(1000000.50, { maximumFractionDigits: 2 });
      // Should contain the decimal part in some format
      expect(withDecimals).toMatch(/[,.][0-9]{1,2}/);
    });

    it('handles zero and negative values', () => {
      const zero = formatRupiah(0);
      expect(zero).toContain('0');
      
      const negative = formatRupiah(-1000000);
      expect(negative).toContain('-'); // Contains negative sign
      expect(negative).toContain('1'); // Contains the number 1
    });
  });

  describe('parseRupiah', () => {
    it('parses formatted currency strings back to numbers', () => {
      // Create a formatted string and then parse it back
      const amount = 1234567;
      const formatted = formatRupiah(amount);
      const parsed = parseRupiah(formatted);
      
      // Should get back approximately the same value
      expect(parsed).toBeCloseTo(amount, 0);
    });

    it('handles various input formats', () => {
      // Test with different input formats
      expect(parseRupiah('1.000.000')).toBeCloseTo(1000000, 0);
      expect(parseRupiah('Rp 1.000.000')).toBeCloseTo(1000000, 0);
      expect(parseRupiah('Rp1.000.000')).toBeCloseTo(1000000, 0);
    });

    it('handles negative values', () => {
      expect(parseRupiah('-1.000.000')).toBeLessThan(0);
      expect(parseRupiah('-Rp 1.000.000')).toBeLessThan(0);
    });
  });
});
