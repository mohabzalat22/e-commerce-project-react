/** attribute code → selected option ids (strings), for `attributes[code][]` query keys */

export type AttributeSelection = Map<string, Set<string>>;

const ARRAY_KEY = /^attributes\[([a-z][a-z0-9_]*)\]\[\]$/;
const SINGLE_KEY = /^attributes\[([a-z][a-z0-9_]*)\]$/;

export function attributeSelectionFromSearchParams(
  sp: URLSearchParams,
): AttributeSelection {
  const out: AttributeSelection = new Map();
  sp.forEach((val, key) => {
    const am = key.match(ARRAY_KEY);
    if (am) {
      const code = am[1];
      if (!out.has(code)) {
        out.set(code, new Set());
      }
      out.get(code)!.add(val);
      return;
    }
    const sm = key.match(SINGLE_KEY);
    if (sm && !key.endsWith("[]")) {
      const code = sm[1];
      if (!out.has(code)) {
        out.set(code, new Set());
      }
      const set = out.get(code)!;
      for (const part of val.split(",")) {
        const t = part.trim();
        if (t) {
          set.add(t);
        }
      }
    }
  });
  return out;
}

export function cloneAttributeSelection(sel: AttributeSelection): AttributeSelection {
  const next: AttributeSelection = new Map();
  sel.forEach((v, k) => {
    next.set(k, new Set(v));
  });
  return next;
}

export function attributeSelectionToRecord(
  sel: AttributeSelection,
): Record<string, string[]> {
  const r: Record<string, string[]> = {};
  sel.forEach((ids, code) => {
    r[code] = Array.from(ids);
  });
  return r;
}

export function buildProductListSearchParams(
  categoryId: number | undefined,
  selection: AttributeSelection,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (categoryId !== undefined) {
    sp.set("category_id", String(categoryId));
  }
  selection.forEach((ids, code) => {
    ids.forEach((id) => {
      sp.append(`attributes[${code}][]`, id);
    });
  });
  return sp;
}
