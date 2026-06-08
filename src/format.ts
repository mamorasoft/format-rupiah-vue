export interface FormatOptions {
  /**
   * The prefix to prepend. Default is 'Rp. '
   */
  prefix?: string;
  /**
   * The number of decimal places to show. Default is 0.
   */
  decimalPlaces?: number;
  /**
   * Character used to separate thousands. Default is '.'
   */
  thousandSeparator?: string;
  /**
   * Character used to separate decimals. Default is ','
   */
  decimalSeparator?: string;
}

const DEFAULT_OPTIONS: Required<FormatOptions> = {
  prefix: 'Rp. ',
  decimalPlaces: 0,
  thousandSeparator: '.',
  decimalSeparator: ',',
};

/**
 * Formats a number or numeric string to Indonesian Rupiah.
 * E.g., 100000 -> "Rp. 100.000"
 */
export function formatRupiah(value: number | string | null | undefined, options?: FormatOptions): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Parse to float
  let num = typeof value === 'number' ? value : parseFloat(parseRupiah(value).toString());
  if (isNaN(num)) {
    return '';
  }

  const isNegative = num < 0;
  num = Math.abs(num);

  // Round to specified decimal places
  const fixedNum = num.toFixed(opts.decimalPlaces);
  const parts = fixedNum.split('.');
  
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add thousand separators
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(integerPart)) {
    integerPart = integerPart.replace(rgx, `$1${opts.thousandSeparator}$2`);
  }

  let result = integerPart;
  if (opts.decimalPlaces > 0 && decimalPart) {
    result += opts.decimalSeparator + decimalPart;
  }

  const sign = isNegative ? '-' : '';
  return `${sign}${opts.prefix}${result}`;
}

/**
 * Parses a Rupiah formatted string back to a number.
 * E.g., "Rp. 100.000" -> 100000
 * E.g., "Rp. 100.000,50" -> 100000.5
 */
export function parseRupiah(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  // Convert to string and clean
  let str = value.toString().trim();

  // Check if it is negative
  const isNegative = str.includes('-');

  // Remove minus sign temporarily to clean the prefix
  str = str.replace(/-/g, '');

  // Remove currency prefix symbols (e.g. "Rp.", "Rp ", "IDR ")
  str = str.replace(/^[a-zA-Z\s]+[.,]?\s*/, '');

  // Remove everything except digits, comma, and period
  // We need to determine which is the decimal separator.
  // Standard IDR: thousand is '.', decimal is ','
  // However, sometimes users might type '.' as decimal or ',' as thousand.
  // Let's assume standard: '.' is thousand, ',' is decimal.
  // We strip all characters except digits, and the last separator if it represents decimals.
  
  // Let's check the position of ',' and '.' to see which is decimal.
  // If there's a comma after the last dot, or if there is only a comma and it's near the end,
  // we treat comma as the decimal separator.
  
  // A robust way to clean thousand separators:
  // If comma exists, and dot exists:
  // If dot is before comma, dot is thousand separator, comma is decimal.
  // If comma is before dot, comma is thousand, dot is decimal (e.g. English format).
  
  let cleanStr = str;
  const lastDot = cleanStr.lastIndexOf('.');
  const lastComma = cleanStr.lastIndexOf(',');

  if (lastDot !== -1 && lastComma !== -1) {
    if (lastDot < lastComma) {
      // Standard IDR format: 1.000.000,50
      // Remove all dots, replace comma with dot
      cleanStr = cleanStr.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // English format: 1,000,000.50
      // Remove all commas, keep dot
      cleanStr = cleanStr.replace(/,/g, '');
    }
  } else if (lastComma !== -1) {
    // Only comma exists. Could be decimal (e.g. 100,50) or thousand (100,000)
    // If it is followed by exactly 2 or 1 digits at the very end, it's likely decimal.
    // Otherwise, if it is followed by 3 digits, let's see. In Indonesia, form input Rp 100,000 is often meant as 100000 (thousand).
    // Let's check if the remaining characters after lastComma length is not 3, then it is a decimal separator.
    const charsAfter = cleanStr.length - 1 - lastComma;
    if (charsAfter === 3) {
      // Treat as thousand separator
      cleanStr = cleanStr.replace(/,/g, '');
    } else {
      // Treat as decimal separator
      cleanStr = cleanStr.replace(/,/g, '.');
    }
  } else if (lastDot !== -1) {
    // Only dot exists. Could be thousand (1.000.000) or decimal (100.5)
    // If it is followed by exactly 3 digits, and there's more digits before, it's likely thousand.
    // If it's near the end (1 or 2 digits), it's likely decimal.
    const charsAfter = cleanStr.length - 1 - lastDot;
    if (charsAfter === 3) {
      // Treat as thousand separator
      cleanStr = cleanStr.replace(/\./g, '');
    } else {
      // Treat as decimal separator, keep dot
    }
  }

  // Remove all non-numeric and non-dot characters
  cleanStr = cleanStr.replace(/[^0-9.]/g, '');

  const parsed = parseFloat(cleanStr);
  if (isNaN(parsed)) {
    return 0;
  }

  return isNegative ? -parsed : parsed;
}
