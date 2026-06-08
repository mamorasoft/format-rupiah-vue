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
export function parseRupiah(value: string | number | null | undefined, options?: FormatOptions): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Convert to string and clean
  let str = value.toString().trim();

  // Check if it is negative
  const isNegative = str.includes('-');

  // Remove minus sign temporarily to clean the prefix
  str = str.replace(/-/g, '');

  // Remove currency prefix symbols (e.g. "Rp.", "Rp ", "IDR ")
  str = str.replace(/^[a-zA-Z\s]+[.,]?\s*/, '');

  let cleanStr = str;

  let thousandSep = opts.thousandSeparator;
  let decimalSep = opts.decimalSeparator;

  // Auto-detect standard programming decimal notation (e.g. "12500.50" or "100.5")
  // ONLY if the original string does not contain currency prefix symbols (letters)
  const hasCurrencyPrefix = /[a-zA-Z]/.test(value.toString());
  if (!hasCurrencyPrefix && decimalSep === ',' && !str.includes(',')) {
    const dotIndex = str.lastIndexOf('.');
    if (dotIndex !== -1) {
      const charsAfter = str.length - 1 - dotIndex;
      if (charsAfter === 1 || charsAfter === 2) {
        decimalSep = '.';
        thousandSep = ',';
      }
    }
  }

  // Escape separators for regex
  const thousandEscaped = thousandSep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const decimalEscaped = decimalSep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Remove thousand separators
  const thousandRegex = new RegExp(thousandEscaped, 'g');
  cleanStr = cleanStr.replace(thousandRegex, '');

  // Replace decimal separator with standard dot for parseFloat
  if (decimalSep !== '.') {
    const decimalRegex = new RegExp(decimalEscaped, 'g');
    cleanStr = cleanStr.replace(decimalRegex, '.');
  }

  // Remove all non-numeric and non-dot characters
  cleanStr = cleanStr.replace(/[^0-9.]/g, '');

  const parsed = parseFloat(cleanStr);
  if (isNaN(parsed)) {
    return 0;
  }

  return isNegative ? -parsed : parsed;
}
