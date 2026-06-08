import { ref, computed } from 'vue';
import { formatRupiah, parseRupiah, FormatOptions } from './format';

/**
 * A Vue 3 composable that manages a reactive number and its formatted Rupiah string representation.
 * 
 * @param initialValue The initial numeric or formatted string value.
 * @param options Formatting configuration options.
 */
export function useRupiah(initialValue: number | string = 0, options?: FormatOptions) {
  const rawValue = ref<number>(
    typeof initialValue === 'number' 
      ? initialValue 
      : parseRupiah(initialValue)
  );

  const formatted = computed({
    get(): string {
      return formatRupiah(rawValue.value, options);
    },
    set(newValue: string) {
      rawValue.value = parseRupiah(newValue);
    }
  });

  return {
    /**
     * The raw numeric value (reactive ref).
     */
    value: rawValue,
    /**
     * The formatted Rupiah string (writable computed property).
     */
    formatted,
    /**
     * Helper to format any value using the same options.
     */
    format: (val: number | string | null | undefined) => formatRupiah(val, options),
    /**
     * Helper to parse any formatted string into a number.
     */
    parse: parseRupiah
  };
}
