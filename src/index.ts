import { App } from 'vue';
import { vRupiah } from './directive';
import { useRupiah } from './composable';
import { formatRupiah, parseRupiah } from './format';
import type { FormatOptions } from './format';

// Define the Vue plugin
const plugin = {
  install(app: App, globalOptions?: FormatOptions) {
    // Register the global directive 'v-rupiah'
    app.directive('rupiah', {
      mounted(el, binding) {
        // Merge global options with binding options
        const options = { ...globalOptions, ...binding.value };
        vRupiah.mounted!(el, { ...binding, value: options }, binding.instance as any, null as any);
      },
      updated(el, binding) {
        const options = { ...globalOptions, ...binding.value };
        vRupiah.updated!(el, { ...binding, value: options }, binding.instance as any, null as any);
      },
      unmounted(el, binding) {
        vRupiah.unmounted!(el, binding, binding.instance as any, null as any);
      }
    });

    // Provide global helper functions
    app.config.globalProperties.$formatRupiah = (value: number | string, options?: FormatOptions) => {
      return formatRupiah(value, { ...globalOptions, ...options });
    };
    
    app.config.globalProperties.$parseRupiah = parseRupiah;
  }
};

export default plugin;
export {
  vRupiah,
  useRupiah,
  formatRupiah,
  parseRupiah,
  FormatOptions
};
