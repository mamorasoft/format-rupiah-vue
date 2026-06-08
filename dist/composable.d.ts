import { parseRupiah, FormatOptions } from './format';

/**
 * A Vue 3 composable that manages a reactive number and its formatted Rupiah string representation.
 *
 * @param initialValue The initial numeric or formatted string value.
 * @param options Formatting configuration options.
 */
export declare function useRupiah(initialValue?: number | string, options?: FormatOptions): {
    /**
     * The raw numeric value (reactive ref).
     */
    value: import('vue').Ref<number, number>;
    /**
     * The formatted Rupiah string (writable computed property).
     */
    formatted: import('vue').WritableComputedRef<string, string>;
    /**
     * Helper to format any value using the same options.
     */
    format: (val: number | string | null | undefined) => string;
    /**
     * Helper to parse any formatted string into a number.
     */
    parse: typeof parseRupiah;
};
