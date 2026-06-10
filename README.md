# format-rupiah-vue

Vue 3 helper library to easily format numbers/nominals to Indonesian Rupiah and parse formatted input values back to numbers.

## Features

- 🪙 **Easy Formatting**: Convert numbers to Rupiah format dynamically (e.g. `100000` -> `Rp. 100.000`).
- 🔄 **Easy Parsing**: Parse formatted Rupiah strings back to numbers (e.g. `Rp. 100.000` -> `100000`).
- 🔌 **Vue 3 Plugin**: Global registration support.
- ⚡ **Directive (`v-rupiah`)**: Automatically formats input values as the user types while keeping cursor position intact.
- 🧪 **Composition API (`useRupiah`)**: Reactive helpers for formatting and parsing.
- ⚙️ **Configurable**: Customize prefix, decimal places, and separators.

---

## Installation

Karena ini merupakan private repository, Anda dapat menginstalnya langsung melalui URL Git:

```bash
npm install github:mamorasoft/format-rupiah-vue
```

---

## Usage

### 1. Global Setup (Vue Plugin)

Register it globally in your main entry file (e.g., `main.js` or `main.ts`):

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import FormatRupiahVue from 'format-rupiah-vue';

const app = createApp(App);

// You can pass default options globally
app.use(FormatRupiahVue, {
  prefix: 'Rp. ',         // default: 'Rp. '
  decimalPlaces: 0,       // default: 0
  thousandSeparator: '.', // default: '.'
  decimalSeparator: ','   // default: ','
});

app.mount('#app');
```

This will:
- Register the `v-rupiah` directive globally.
- Provide global helpers `$formatRupiah` and `$parseRupiah` on the Vue instance.

---

### 2. Custom Directive (`v-rupiah`)

Apply `v-rupiah` to your inputs. It dynamically formats the value as you type.

When submitting a form, you can parse the formatted input value back to a raw number using `parseRupiah`.

#### Basic Example:
```html
<script setup>
import { ref } from 'vue';
import { parseRupiah } from 'format-rupiah-vue';

const nominal = ref('');

const handleSubmit = () => {
  // Convert "Rp. 100.000" back to numeric 100000
  const numericValue = parseRupiah(nominal.value);
  console.log('Submitted Value:', numericValue); // output: 100000
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label>Nominal:</label>
    <input v-model="nominal" v-rupiah placeholder="Rp. 0" />
    <button type="submit">Submit</button>
  </form>
</template>
```

#### Custom Options in Directive:
You can pass custom options directly to the directive:
```html
<input v-model="nominal" v-rupiah="{ prefix: 'IDR ', decimalPlaces: 2 }" />
```

---

### 3. Composition API (`useRupiah`)

For a more reactive approach, use the `useRupiah` composable. It manages a raw numeric ref and a formatted computed property:

```html
<script setup>
import { useRupiah } from 'format-rupiah-vue';

// Initialize with a default value
const { value, formatted } = useRupiah(100000, { decimalPlaces: 0 });

const addBonus = () => {
  // You can easily do math with the raw number
  value.value += 50000;
};
</script>

<template>
  <div>
    <!-- Changing this input automatically updates 'value' as a clean number -->
    <input v-model="formatted" />

    <p>Raw Value: {{ value }} (Type: {{ typeof value }})</p>
    <p>Formatted: {{ formatted }}</p>

    <button @click="addBonus">Add Rp. 50.000</button>
  </div>
</template>
```

---

### 4. Utility Functions

You can also import and use the core format and parse functions directly anywhere in your JavaScript/TypeScript code:

```typescript
import { formatRupiah, parseRupiah } from 'format-rupiah-vue';

// Formatting
console.log(formatRupiah(100000)); // "Rp. 100.000"
console.log(formatRupiah(250000.5, { decimalPlaces: 2 })); // "Rp. 250.000,50"
console.log(formatRupiah(75000, { prefix: 'Rp ' })); // "Rp 75.000"

// Parsing
console.log(parseRupiah('Rp. 100.000')); // 100000
console.log(parseRupiah('Rp. 250.000,50')); // 250000.5
console.log(parseRupiah('100.000')); // 100000
```

> [!IMPORTANT]
> **Penting tentang Konfigurasi Global:**
> - Jika memanggil di dalam `<script>` komponen Vue, gunakan **`this.$formatRupiah(value)`** atau **`this.$parseRupiah(value)`** agar otomatis mengikuti konfigurasi global (misalnya `Rp `) yang Anda daftarkan di `main.js`.
> - Jika memanggil di dalam `<template>`, Anda dapat menulis langsung **`{{ $formatRupiah(value) }}`**.
> - Mengimpor langsung menggunakan **`import { formatRupiah } from 'format-rupiah-vue'`** tidak akan menggunakan konfigurasi global karena fungsi tersebut dieksekusi di luar instance Vue. Dalam kasus tersebut, ia akan selalu menggunakan format bawaan (`Rp. `) kecuali Anda memberikan opsi lokal secara manual, misalnya: `formatRupiah(100000, { prefix: 'Rp ' })`.

---

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `prefix` | `string` | `'Rp. '` | Currency symbol or label prepended to the number. |
| `decimalPlaces` | `number` | `0` | Number of decimal places to show. |
| `thousandSeparator` | `string` | `'.'` | Character separating thousands. |
| `decimalSeparator` | `string` | `','` | Character separating decimal fractions. |

---

## License

MIT License

---

## Creator

- [alfin-dev](https://github.com/alfin-dev)
