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
/**
 * Formats a number or numeric string to Indonesian Rupiah.
 * E.g., 100000 -> "Rp. 100.000"
 */
export declare function formatRupiah(value: number | string | null | undefined, options?: FormatOptions): string;
/**
 * Parses a Rupiah formatted string back to a number.
 * E.g., "Rp. 100.000" -> 100000
 * E.g., "Rp. 100.000,50" -> 100000.5
 */
export declare function parseRupiah(value: string | number | null | undefined, options?: FormatOptions): number;
