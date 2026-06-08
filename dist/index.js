import { ref as v, computed as g } from "vue";
const E = {
  prefix: "Rp. ",
  decimalPlaces: 0,
  thousandSeparator: ".",
  decimalSeparator: ","
};
function p(t, r) {
  if (t == null || t === "")
    return "";
  const n = { ...E, ...r };
  let e = typeof t == "number" ? t : parseFloat(o(t).toString());
  if (isNaN(e))
    return "";
  const a = e < 0;
  e = Math.abs(e);
  const s = e.toFixed(n.decimalPlaces).split(".");
  let i = s[0];
  const l = s[1] || "", c = /(\d+)(\d{3})/;
  for (; c.test(i); )
    i = i.replace(c, `$1${n.thousandSeparator}$2`);
  let f = i;
  return n.decimalPlaces > 0 && l && (f += n.decimalSeparator + l), `${a ? "-" : ""}${n.prefix}${f}`;
}
function o(t) {
  if (t == null || t === "")
    return 0;
  if (typeof t == "number")
    return t;
  let r = t.toString().trim();
  const n = r.includes("-");
  r = r.replace(/-/g, ""), r = r.replace(/^[a-zA-Z\s]+[.,]?\s*/, "");
  let e = r;
  const a = e.lastIndexOf("."), u = e.lastIndexOf(",");
  a !== -1 && u !== -1 ? a < u ? e = e.replace(/\./g, "").replace(/,/g, ".") : e = e.replace(/,/g, "") : u !== -1 ? e.length - 1 - u === 3 ? e = e.replace(/,/g, "") : e = e.replace(/,/g, ".") : a !== -1 && e.length - 1 - a >= 3 && (e = e.replace(/\./g, "")), e = e.replace(/[^0-9.]/g, "");
  const s = parseFloat(e);
  return isNaN(s) ? 0 : n ? -s : s;
}
const d = {
  mounted(t, r) {
    let n = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!n) {
      console.warn("v-rupiah directive requires an input element");
      return;
    }
    const e = n;
    e._rupiahOptions = r.value, e.value && (e.value = p(e.value, e._rupiahOptions));
    const a = (u) => {
      if (u.defaultPrevented) return;
      const s = e.value, i = o(s), l = p(i, e._rupiahOptions), c = e.selectionStart, f = e.selectionEnd;
      if (s !== l) {
        if (e.value = l, c !== null && f !== null) {
          const h = l.length - s.length, m = c === s.length ? l.length : Math.max(0, c + h);
          e.setSelectionRange(m, m);
        }
        e.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    };
    e._rupiahInputListener = a, e.addEventListener("input", a);
  },
  updated(t, r) {
    let n = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!n) return;
    const e = n;
    e._rupiahOptions = r.value;
    const a = o(e.value);
    typeof r.value == "object" || o(r.value);
    const u = p(a, e._rupiahOptions);
    e.value !== u && (e.value = u);
  },
  unmounted(t) {
    let r = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!r) return;
    const n = r;
    n._rupiahInputListener && (n.removeEventListener("input", n._rupiahInputListener), delete n._rupiahInputListener), delete n._rupiahOptions;
  }
};
function x(t = 0, r) {
  const n = v(
    typeof t == "number" ? t : o(t)
  ), e = g({
    get() {
      return p(n.value, r);
    },
    set(a) {
      n.value = o(a);
    }
  });
  return {
    /**
     * The raw numeric value (reactive ref).
     */
    value: n,
    /**
     * The formatted Rupiah string (writable computed property).
     */
    formatted: e,
    /**
     * Helper to format any value using the same options.
     */
    format: (a) => p(a, r),
    /**
     * Helper to parse any formatted string into a number.
     */
    parse: o
  };
}
const I = {
  install(t, r) {
    t.directive("rupiah", {
      mounted(n, e) {
        const a = { ...r, ...e.value };
        d.mounted(n, { ...e, value: a }, e.instance, null);
      },
      updated(n, e) {
        const a = { ...r, ...e.value };
        d.updated(n, { ...e, value: a }, e.instance, null);
      },
      unmounted(n, e) {
        d.unmounted(n, e, e.instance, null);
      }
    }), t.config.globalProperties.$formatRupiah = (n, e) => p(n, { ...r, ...e }), t.config.globalProperties.$parseRupiah = o;
  }
};
export {
  I as default,
  p as formatRupiah,
  o as parseRupiah,
  x as useRupiah,
  d as vRupiah
};
