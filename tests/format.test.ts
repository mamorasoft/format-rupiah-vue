import { describe, it, expect } from 'vitest';
import { formatRupiah, parseRupiah } from '../src/format';

describe('formatRupiah', () => {
  it('should format numbers correctly with default options', () => {
    expect(formatRupiah(100000)).toBe('Rp. 100.000');
    expect(formatRupiah(1000)).toBe('Rp. 1.000');
    expect(formatRupiah(500)).toBe('Rp. 500');
    expect(formatRupiah(123456789)).toBe('Rp. 123.456.789');
  });

  it('should handle numeric strings', () => {
    expect(formatRupiah('100000')).toBe('Rp. 100.000');
    expect(formatRupiah('12500.50')).toBe('Rp. 12.501'); // default 0 decimal places rounds
  });

  it('should handle null, undefined, empty values', () => {
    expect(formatRupiah(null)).toBe('');
    expect(formatRupiah(undefined)).toBe('');
    expect(formatRupiah('')).toBe('');
  });

  it('should format negative numbers', () => {
    expect(formatRupiah(-100000)).toBe('-Rp. 100.000');
    expect(formatRupiah('-100000')).toBe('-Rp. 100.000');
  });

  it('should support custom decimal places', () => {
    expect(formatRupiah(100000, { decimalPlaces: 2 })).toBe('Rp. 100.000,00');
    expect(formatRupiah(100000.55, { decimalPlaces: 2 })).toBe('Rp. 100.000,55');
    expect(formatRupiah(100000.553, { decimalPlaces: 2 })).toBe('Rp. 100.000,55');
    expect(formatRupiah(100000.557, { decimalPlaces: 2 })).toBe('Rp. 100.000,56');
  });

  it('should support custom prefixes', () => {
    expect(formatRupiah(100000, { prefix: 'Rp ' })).toBe('Rp 100.000');
    expect(formatRupiah(100000, { prefix: 'IDR ' })).toBe('IDR 100.000');
    expect(formatRupiah(100000, { prefix: '' })).toBe('100.000');
  });

  it('should support custom separators', () => {
    expect(formatRupiah(100000.5, {
      decimalPlaces: 1,
      thousandSeparator: ',',
      decimalSeparator: '.'
    })).toBe('Rp. 100,000.5');
  });
});

describe('parseRupiah', () => {
  it('should parse formatted strings back to numbers', () => {
    expect(parseRupiah('Rp. 100.000')).toBe(100000);
    expect(parseRupiah('Rp. 1.000')).toBe(1000);
    expect(parseRupiah('Rp. 500')).toBe(500);
    expect(parseRupiah('100.000')).toBe(100000);
    expect(parseRupiah('Rp 100.000')).toBe(100000);
    expect(parseRupiah('IDR 100.000')).toBe(100000);
  });

  it('should handle decimal values', () => {
    expect(parseRupiah('Rp. 100.000,50')).toBe(100000.5);
    expect(parseRupiah('100.000,75')).toBe(100000.75);
    expect(parseRupiah('100,5')).toBe(100.5);
  });

  it('should handle negative values', () => {
    expect(parseRupiah('-Rp. 100.000')).toBe(-100000);
    expect(parseRupiah('Rp. -100.000')).toBe(-100000);
    expect(parseRupiah('-100.000')).toBe(-100000);
  });

  it('should return number directly if passed a number', () => {
    expect(parseRupiah(125000)).toBe(125000);
    expect(parseRupiah(-500)).toBe(-500);
  });

  it('should return 0 for empty or invalid values', () => {
    expect(parseRupiah(null)).toBe(0);
    expect(parseRupiah(undefined)).toBe(0);
    expect(parseRupiah('')).toBe(0);
    expect(parseRupiah('abc')).toBe(0);
  });
});
