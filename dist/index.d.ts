import { App } from 'vue';
import { vRupiah } from './directive';
import { useRupiah } from './composable';
import { formatRupiah, parseRupiah, FormatOptions } from './format';

declare const plugin: {
    install(app: App, globalOptions?: FormatOptions): void;
};
export default plugin;
export { vRupiah, useRupiah, formatRupiah, parseRupiah, FormatOptions };
