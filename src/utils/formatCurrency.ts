/**
 * Formats a number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatRupiah(
  amount: number, 
  options: { 
    showSymbol?: boolean,
    maximumFractionDigits?: number 
  } = {}
): string {
  const { 
    showSymbol = true,
    maximumFractionDigits = 0
  } = options;

  try {
    // Try to use the Indonesian locale
    return amount.toLocaleString('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits,
      ...(showSymbol ? {} : { currencyDisplay: 'code' })
    });
  } catch (error) {
    // Fallback for environments where the locale isn't supported
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    const formatted = absAmount.toFixed(maximumFractionDigits);
    const withThousandSeparator = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return showSymbol 
      ? `${sign}Rp ${withThousandSeparator}` 
      : `${sign}IDR ${withThousandSeparator}`;
  }
}

/**
 * Parses a formatted Rupiah string back to a number
 * @param formattedAmount - The formatted amount string
 * @returns Numeric value
 */
export function parseRupiah(formattedAmount: string): number {
  // Handle negative values
  const isNegative = formattedAmount.includes('-');
  
  // Remove currency symbol, dots, and replace comma with dot for decimal
  let cleanedString = formattedAmount
    .replace(/[^\d,.\-]/g, '') // Remove everything except digits, comma, dot, and minus
    .replace(/\-/g, '')        // Remove minus sign (we'll add it back later if needed)
    .replace(/\./g, '')        // Remove dots (thousand separators)
    .replace(/,/g, '.');       // Replace comma with dot for decimal
  
  // If the string is empty after cleaning, return 0
  if (!cleanedString) {
    return 0;
  }
  
  // Parse the cleaned string to a number
  let result = parseFloat(cleanedString);
  
  // Apply negative sign if needed
  return isNegative ? -result : result;
}
