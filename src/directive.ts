import { ObjectDirective } from 'vue';
import { formatRupiah, parseRupiah, FormatOptions } from './format';

// Extend HTMLInputElement to store our custom listeners and options
interface RupiahInputElement extends HTMLInputElement {
  _rupiahOptions?: FormatOptions;
  _rupiahInputListener?: (event: Event) => void;
}

export const vRupiah: ObjectDirective<HTMLElement, FormatOptions | undefined> = {
  mounted(el, binding) {
    // Check if element is input, if not try to find an input child (e.g. inside a wrapper)
    let inputEl = el instanceof HTMLInputElement ? el : el.querySelector('input');
    if (!inputEl) {
      console.warn('v-rupiah directive requires an input element');
      return;
    }

    const rupiahEl = inputEl as RupiahInputElement;
    rupiahEl._rupiahOptions = typeof binding.value === 'object' && binding.value !== null ? binding.value : undefined;

    // Format initial value if exists
    if (rupiahEl.value) {
      const formatted = formatRupiah(rupiahEl.value, rupiahEl._rupiahOptions);
      if (rupiahEl.value !== formatted) {
        rupiahEl.value = formatted;
        rupiahEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    // Input listener to format value dynamically on typing
    const listener = (event: Event) => {
      // Prevent infinite loops from synthetic events
      if (event.defaultPrevented) return;

      const rawValue = rupiahEl.value;
      const parsed = parseRupiah(rawValue);
      const formatted = formatRupiah(parsed, rupiahEl._rupiahOptions);

      // Save cursor selection position
      const selectionStart = rupiahEl.selectionStart;
      const selectionEnd = rupiahEl.selectionEnd;

      if (rawValue !== formatted) {
        rupiahEl.value = formatted;

        // Restore cursor position with adjustment for added/removed characters
        if (selectionStart !== null && selectionEnd !== null) {
          const diff = formatted.length - rawValue.length;

          // Basic heuristic: if caret was at the end, keep it at the end.
          // Otherwise, adjust by the length difference.
          const isAtEnd = selectionStart === rawValue.length;
          const newCursor = isAtEnd ? formatted.length : Math.max(0, selectionStart + diff);

          rupiahEl.setSelectionRange(newCursor, newCursor);
        }

        // Trigger input event to update v-model in Vue
        rupiahEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    rupiahEl._rupiahInputListener = listener;
    rupiahEl.addEventListener('input', listener);
  },

  updated(el, binding) {
    let inputEl = el instanceof HTMLInputElement ? el : el.querySelector('input');
    if (!inputEl) return;

    const rupiahEl = inputEl as RupiahInputElement;
    rupiahEl._rupiahOptions = typeof binding.value === 'object' && binding.value !== null ? binding.value : undefined;

    // Re-format whenever the DOM value doesn't match the formatted representation
    const currentParsed = parseRupiah(rupiahEl.value);
    const formatted = formatRupiah(currentParsed, rupiahEl._rupiahOptions);
    if (rupiahEl.value !== formatted) {
      rupiahEl.value = formatted;
      rupiahEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },

  unmounted(el) {
    let inputEl = el instanceof HTMLInputElement ? el : el.querySelector('input');
    if (!inputEl) return;

    const rupiahEl = inputEl as RupiahInputElement;
    if (rupiahEl._rupiahInputListener) {
      rupiahEl.removeEventListener('input', rupiahEl._rupiahInputListener);
      delete rupiahEl._rupiahInputListener;
    }
    delete rupiahEl._rupiahOptions;
  }
};
