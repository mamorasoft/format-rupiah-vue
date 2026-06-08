import { ref as S, computed as x } from "vue";
const E = {
  prefix: "Rp. ",
  decimalPlaces: 0,
  thousandSeparator: ".",
  decimalSeparator: ","
};
function f(t, a) {
  if (t == null || t === "")
    return "";
  const n = { ...E, ...a };
  let e = typeof t == "number" ? t : parseFloat(p(t).toString());
  if (isNaN(e))
    return "";
  const u = e < 0;
  e = Math.abs(e);
  const s = e.toFixed(n.decimalPlaces).split(".");
  let o = s[0];
  const i = s[1] || "", l = /(\d+)(\d{3})/;
  for (; l.test(o); )
    o = o.replace(l, `$1${n.thousandSeparator}$2`);
  let d = o;
  return n.decimalPlaces > 0 && i && (d += n.decimalSeparator + i), `${u ? "-" : ""}${n.prefix}${d}`;
}
function p(t, a) {
  if (t == null || t === "")
    return 0;
  if (typeof t == "number")
    return t;
  const n = { ...E, ...a };
  let e = t.toString().trim();
  const u = e.includes("-");
  e = e.replace(/-/g, ""), e = e.replace(/^[a-zA-Z\s]+[.,]?\s*/, "");
  let r = e, s = n.thousandSeparator, o = n.decimalSeparator;
  if (!/[a-zA-Z]/.test(t.toString()) && o === "," && !e.includes(",")) {
    const c = e.lastIndexOf(".");
    if (c !== -1) {
      const g = e.length - 1 - c;
      (g === 1 || g === 2) && (o = ".", s = ",");
    }
  }
  const l = s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), d = o.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), h = new RegExp(l, "g");
  if (r = r.replace(h, ""), o !== ".") {
    const c = new RegExp(d, "g");
    r = r.replace(c, ".");
  }
  r = r.replace(/[^0-9.]/g, "");
  const m = parseFloat(r);
  return isNaN(m) ? 0 : u ? -m : m;
}
const v = {
  mounted(t, a) {
    let n = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!n) {
      console.warn("v-rupiah directive requires an input element");
      return;
    }
    const e = n;
    if (e._rupiahOptions = a.value, console.log("v-rupiah mounted: initial value =", e.value), e.value) {
      const r = f(e.value, e._rupiahOptions);
      console.log("v-rupiah mounted: formatting", e.value, "to", r), e.value !== r && (e.value = r, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    const u = (r) => {
      if (r.defaultPrevented) return;
      const s = e.value, o = p(s), i = f(o, e._rupiahOptions), l = e.selectionStart, d = e.selectionEnd;
      if (s !== i) {
        if (e.value = i, l !== null && d !== null) {
          const h = i.length - s.length, c = l === s.length ? i.length : Math.max(0, l + h);
          e.setSelectionRange(c, c);
        }
        e.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    };
    e._rupiahInputListener = u, e.addEventListener("input", u);
  },
  updated(t, a) {
    let n = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!n) return;
    const e = n;
    e._rupiahOptions = a.value, console.log("v-rupiah updated: value =", e.value);
    const u = p(e.value), r = f(u, e._rupiahOptions);
    console.log("v-rupiah updated: currentParsed =", u, "formatted =", r), e.value !== r && (e.value = r, e.dispatchEvent(new Event("input", { bubbles: !0 })));
  },
  unmounted(t) {
    let a = t instanceof HTMLInputElement ? t : t.querySelector("input");
    if (!a) return;
    const n = a;
    n._rupiahInputListener && (n.removeEventListener("input", n._rupiahInputListener), delete n._rupiahInputListener), delete n._rupiahOptions;
  }
};
function R(t = 0, a) {
  const n = S(
    typeof t == "number" ? t : p(t)
  ), e = x({
    get() {
      return f(n.value, a);
    },
    set(u) {
      n.value = p(u);
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
    format: (u) => f(u, a),
    /**
     * Helper to parse any formatted string into a number.
     */
    parse: p
  };
}
const $ = {
  install(t, a) {
    t.directive("rupiah", {
      mounted(n, e) {
        const u = { ...a, ...e.value };
        v.mounted(n, { ...e, value: u }, e.instance, null);
      },
      updated(n, e) {
        const u = { ...a, ...e.value };
        v.updated(n, { ...e, value: u }, e.instance, null);
      },
      unmounted(n, e) {
        v.unmounted(n, e, e.instance, null);
      }
    }), t.config.globalProperties.$formatRupiah = (n, e) => f(n, { ...a, ...e }), t.config.globalProperties.$parseRupiah = p;
  }
};
export {
  $ as default,
  f as formatRupiah,
  p as parseRupiah,
  R as useRupiah,
  v as vRupiah
};
