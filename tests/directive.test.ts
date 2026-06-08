import { describe, it, expect } from 'vitest';
import { createApp, nextTick, ref } from 'vue';
import { useRupiah } from '../src/composable';
import { vRupiah } from '../src/directive';

describe('useRupiah Composable', () => {
  it('should reactively format and parse values', async () => {
    const { value, formatted } = useRupiah(100000);

    expect(value.value).toBe(100000);
    expect(formatted.value).toBe('Rp. 100.000');

    // Modifying formatted should update raw value
    formatted.value = 'Rp. 250.000';
    expect(value.value).toBe(250000);

    // Modifying raw value should update formatted
    value.value = 5000;
    expect(formatted.value).toBe('Rp. 5.000');
  });

  it('should accept custom options in composable', () => {
    const { formatted } = useRupiah(125000.5, {
      prefix: 'IDR ',
      decimalPlaces: 2,
    });
    expect(formatted.value).toBe('IDR 125.000,50');
  });
});

describe('vRupiah Directive', () => {
  it('should format input value on mount', async () => {
    const container = document.createElement('div');
    const input = document.createElement('input');
    input.value = '150000';
    container.appendChild(input);

    const app = createApp({
      directives: { rupiah: vRupiah },
      template: '<input v-rupiah value="150000" />'
    });

    const root = app.mount(container);
    await new Promise(resolve => setTimeout(resolve, 0));

    const inputEl = container.querySelector('input') as HTMLInputElement;
    expect(inputEl.value).toBe('Rp. 150.000');
  });
});
