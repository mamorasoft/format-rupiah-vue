import { ref as x, computed as b } from "vue";
const S = {
  prefix: "Rp. ",
  decimalPlaces: 0,
  thousandSeparator: ".",
  decimalSeparator: ","
};
function h(e, i) {
  if (e == null || e === "")
    return "";
  const n = { ...S, ...i };
  let t = typeof e == "number" ? e : parseFloat(d(e).toString());
  if (isNaN(t))
    return "";
  const r = t < 0;
  t = Math.abs(t);
  const c = t.toFixed(n.decimalPlaces).split(".");
  let o = c[0];
  const u = c[1] || "", s = /(\d+)(\d{3})/;
  for (; s.test(o); )
    o = o.replace(s, `$1${n.thousandSeparator}$2`);
  let f = o;
  return n.decimalPlaces > 0 && u && (f += n.decimalSeparator + u), `${r ? "-" : ""}${n.prefix}${f}`;
}
function d(e, i) {
  if (e == null || e === "")
    return 0;
  if (typeof e == "number")
    return e;
  const n = { ...S, ...i };
  let t = e.toString().trim();
  const r = t.includes("-");
  t = t.replace(/-/g, ""), t = t.replace(/^[a-zA-Z\s]+[.,]?\s*/, "");
  let a = t, c = n.thousandSeparator, o = n.decimalSeparator;
  if (!/[a-zA-Z]/.test(e.toString()) && o === "," && !t.includes(",")) {
    const m = t.lastIndexOf(".");
    if (m !== -1) {
      const g = t.length - 1 - m;
      (g === 1 || g === 2) && (o = ".", c = ",");
    }
  }
  const s = c.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), f = o.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), l = new RegExp(s, "g");
  if (a = a.replace(l, ""), o !== ".") {
    const m = new RegExp(f, "g");
    a = a.replace(m, ".");
  }
  a = a.replace(/[^0-9.]/g, "");
  const p = parseFloat(a);
  return isNaN(p) ? 0 : r ? -p : p;
}
const v = {
  mounted(e, i) {
    let n = e instanceof HTMLInputElement ? e : e.querySelector("input");
    if (!n) {
      console.warn("v-rupiah directive requires an input element");
      return;
    }
    const t = n, r = i.value, a = r !== void 0, c = a && (typeof r == "number" || typeof r == "string" || r === null);
    a && !c && typeof r == "object" && (t._rupiahOptions = r), setTimeout(() => {
      const u = c ? r : t.value;
      if (u != null && u !== "") {
        const s = h(u, t._rupiahOptions);
        t.value !== s && (t.value = s, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }, 0);
    const o = (u) => {
      if (u.defaultPrevented) return;
      const s = t.value, f = d(s), l = h(f, t._rupiahOptions), p = t.selectionStart, m = t.selectionEnd;
      if (s !== l) {
        if (t.value = l, p !== null && m !== null) {
          const g = l.length - s.length, E = p === s.length ? l.length : Math.max(0, p + g);
          t.setSelectionRange(E, E);
        }
        t.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    };
    t._rupiahInputListener = o, t.addEventListener("input", o);
  },
  updated(e, i) {
    let n = e instanceof HTMLInputElement ? e : e.querySelector("input");
    if (!n) return;
    const t = n, r = i.value, a = r !== void 0, c = a && (typeof r == "number" || typeof r == "string" || r === null);
    a && !c && typeof r == "object" && (t._rupiahOptions = r);
    const o = c ? r : t.value, u = d(o), s = h(u, t._rupiahOptions);
    t.value !== s && (t.value = s, t.dispatchEvent(new Event("input", { bubbles: !0 })));
  },
  unmounted(e) {
    let i = e instanceof HTMLInputElement ? e : e.querySelector("input");
    if (!i) return;
    const n = i;
    n._rupiahInputListener && (n.removeEventListener("input", n._rupiahInputListener), delete n._rupiahInputListener), delete n._rupiahOptions;
  }
};
function R(e = 0, i) {
  const n = x(
    typeof e == "number" ? e : d(e)
  ), t = b({
    get() {
      return h(n.value, i);
    },
    set(r) {
      n.value = d(r);
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
    formatted: t,
    /**
     * Helper to format any value using the same options.
     */
    format: (r) => h(r, i),
    /**
     * Helper to parse any formatted string into a number.
     */
    parse: d
  };
}
const w = {
  install(e, i) {
    e.directive("rupiah", {
      mounted(n, t) {
        const r = { ...i, ...t.value };
        v.mounted(n, { ...t, value: r }, t.instance, null);
      },
      updated(n, t) {
        const r = { ...i, ...t.value };
        v.updated(n, { ...t, value: r }, t.instance, null);
      },
      unmounted(n, t) {
        v.unmounted(n, t, t.instance, null);
      }
    }), e.config.globalProperties.$formatRupiah = (n, t) => h(n, { ...i, ...t }), e.config.globalProperties.$parseRupiah = d;
  }
};
export {
  w as default,
  h as formatRupiah,
  d as parseRupiah,
  R as useRupiah,
  v as vRupiah
};
