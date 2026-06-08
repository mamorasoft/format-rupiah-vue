import { ref as S, computed as x } from "vue";
const E = {
  prefix: "Rp. ",
  decimalPlaces: 0,
  thousandSeparator: ".",
  decimalSeparator: ","
};
function f(t, r) {
  if (t == null || t === "")
    return "";
  const n = { ...E, ...r };
  let e = typeof t == "number" ? t : parseFloat(l(t).toString());
  if (isNaN(e))
    return "";
  const a = e < 0;
  e = Math.abs(e);
  const o = e.toFixed(n.decimalPlaces).split(".");
  let u = o[0];
  const i = o[1] || "", c = /(\d+)(\d{3})/;
  for (; c.test(u); )
    u = u.replace(c, `$1${n.thousandSeparator}$2`);
  let d = u;
  return n.decimalPlaces > 0 && i && (d += n.decimalSeparator + i), `${a ? "-" : ""}${n.prefix}${d}`;
}
function l(t, r) {
  if (t == null || t === "")
    return 0;
  if (typeof t == "number")
    return t;
  const n = { ...E, ...r };
  let e = t.toString().trim();
  const a = e.includes("-");
  e = e.replace(/-/g, ""), e = e.replace(/^[a-zA-Z\s]+[.,]?\s*/, "");
  let s = e, o = n.thousandSeparator, u = n.decimalSeparator;
  if (!/[a-zA-Z]/.test(t.toString()) && u === "," && !e.includes(",")) {
    const p = e.lastIndexOf(".");
    if (p !== -1) {
      const v = e.length - 1 - p;
      (v === 1 || v === 2) && (u = ".", o = ",");
    }
  }
  const c = o.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), d = u.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), h = new RegExp(c, "g");
  if (s = s.replace(h, ""), u !== ".") {
    const p = new RegExp(d, "g");
    s = s.replace(p, ".");
  }
  s = s.replace(/[^0-9.]/g, "");
  const m = parseFloat(s);
  return isNaN(m) ? 0 : a ? -m : m;
}
const g = {
  mounted(t, r) {
    let n = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!n) {
      console.warn("v-rupiah directive requires an input element");
      return;
    }
    const e = n;
    e._rupiahOptions = r.value, e.value && (e.value = f(e.value, e._rupiahOptions));
    const a = (s) => {
      if (s.defaultPrevented) return;
      const o = e.value, u = l(o), i = f(u, e._rupiahOptions), c = e.selectionStart, d = e.selectionEnd;
      if (o !== i) {
        if (e.value = i, c !== null && d !== null) {
          const h = i.length - o.length, p = c === o.length ? i.length : Math.max(0, c + h);
          e.setSelectionRange(p, p);
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
    const a = l(e.value);
    typeof r.value == "object" || l(r.value);
    const s = f(a, e._rupiahOptions);
    e.value !== s && (e.value = s);
  },
  unmounted(t) {
    let r = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!r) return;
    const n = r;
    n._rupiahInputListener && (n.removeEventListener("input", n._rupiahInputListener), delete n._rupiahInputListener), delete n._rupiahOptions;
  }
};
function R(t = 0, r) {
  const n = S(
    typeof t == "number" ? t : l(t)
  ), e = x({
    get() {
      return f(n.value, r);
    },
    set(a) {
      n.value = l(a);
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
    format: (a) => f(a, r),
    /**
     * Helper to parse any formatted string into a number.
     */
    parse: l
  };
}
const $ = {
  install(t, r) {
    t.directive("rupiah", {
      mounted(n, e) {
        const a = { ...r, ...e.value };
        g.mounted(n, { ...e, value: a }, e.instance, null);
      },
      updated(n, e) {
        const a = { ...r, ...e.value };
        g.updated(n, { ...e, value: a }, e.instance, null);
      },
      unmounted(n, e) {
        g.unmounted(n, e, e.instance, null);
      }
    }), t.config.globalProperties.$formatRupiah = (n, e) => f(n, { ...r, ...e }), t.config.globalProperties.$parseRupiah = l;
  }
};
export {
  $ as default,
  f as formatRupiah,
  l as parseRupiah,
  R as useRupiah,
  g as vRupiah
};
