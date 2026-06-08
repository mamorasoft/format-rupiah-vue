import { ref as S, computed as x } from "vue";
const g = {
  prefix: "Rp. ",
  decimalPlaces: 0,
  thousandSeparator: ".",
  decimalSeparator: ","
};
function f(t, r) {
  if (t == null || t === "")
    return "";
  const n = { ...g, ...r };
  let e = typeof t == "number" ? t : parseFloat(p(t).toString());
  if (isNaN(e))
    return "";
  const a = e < 0;
  e = Math.abs(e);
  const o = e.toFixed(n.decimalPlaces).split(".");
  let s = o[0];
  const i = o[1] || "", c = /(\d+)(\d{3})/;
  for (; c.test(s); )
    s = s.replace(c, `$1${n.thousandSeparator}$2`);
  let d = s;
  return n.decimalPlaces > 0 && i && (d += n.decimalSeparator + i), `${a ? "-" : ""}${n.prefix}${d}`;
}
function p(t, r) {
  if (t == null || t === "")
    return 0;
  if (typeof t == "number")
    return t;
  const n = { ...g, ...r };
  let e = t.toString().trim();
  const a = e.includes("-");
  e = e.replace(/-/g, ""), e = e.replace(/^[a-zA-Z\s]+[.,]?\s*/, "");
  let u = e, o = n.thousandSeparator, s = n.decimalSeparator;
  if (!/[a-zA-Z]/.test(t.toString()) && s === "," && !e.includes(",")) {
    const l = e.lastIndexOf(".");
    if (l !== -1) {
      const E = e.length - 1 - l;
      (E === 1 || E === 2) && (s = ".", o = ",");
    }
  }
  const c = o.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), d = s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), h = new RegExp(c, "g");
  if (u = u.replace(h, ""), s !== ".") {
    const l = new RegExp(d, "g");
    u = u.replace(l, ".");
  }
  u = u.replace(/[^0-9.]/g, "");
  const m = parseFloat(u);
  return isNaN(m) ? 0 : a ? -m : m;
}
const v = {
  mounted(t, r) {
    let n = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!n) {
      console.warn("v-rupiah directive requires an input element");
      return;
    }
    const e = n;
    if (e._rupiahOptions = typeof r.value == "object" && r.value !== null ? r.value : void 0, e.value) {
      const u = f(e.value, e._rupiahOptions);
      e.value !== u && (e.value = u, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    const a = (u) => {
      if (u.defaultPrevented) return;
      const o = e.value, s = p(o), i = f(s, e._rupiahOptions), c = e.selectionStart, d = e.selectionEnd;
      if (o !== i) {
        if (e.value = i, c !== null && d !== null) {
          const h = i.length - o.length, l = c === o.length ? i.length : Math.max(0, c + h);
          e.setSelectionRange(l, l);
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
    e._rupiahOptions = typeof r.value == "object" && r.value !== null ? r.value : void 0;
    const a = p(e.value), u = f(a, e._rupiahOptions);
    e.value !== u && (e.value = u, e.dispatchEvent(new Event("input", { bubbles: !0 })));
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
    typeof t == "number" ? t : p(t)
  ), e = x({
    get() {
      return f(n.value, r);
    },
    set(a) {
      n.value = p(a);
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
    parse: p
  };
}
const $ = {
  install(t, r) {
    t.directive("rupiah", {
      mounted(n, e) {
        const a = { ...r, ...e.value };
        v.mounted(n, { ...e, value: a }, e.instance, null);
      },
      updated(n, e) {
        const a = { ...r, ...e.value };
        v.updated(n, { ...e, value: a }, e.instance, null);
      },
      unmounted(n, e) {
        v.unmounted(n, e, e.instance, null);
      }
    }), t.config.globalProperties.$formatRupiah = (n, e) => f(n, { ...r, ...e }), t.config.globalProperties.$parseRupiah = p;
  }
};
export {
  $ as default,
  f as formatRupiah,
  p as parseRupiah,
  R as useRupiah,
  v as vRupiah
};
