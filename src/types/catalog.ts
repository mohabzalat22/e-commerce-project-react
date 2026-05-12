/** PLP card shape used by ProductGrid / ProductCard */
export type PlProduct = {
  id: number;
  name: string;
  price: string;
  image: string;
  colors: string[];
  isNew?: boolean;
};

export type ApiCategoryBrief = {
  id: number;
  name: string;
  slug?: string;
  image_url?: string | null;
  description?: string | null;
};

export type ApiProductImage = {
  image_url: string;
  alt_text?: string | null;
  is_primary?: boolean;
  sort_order?: number;
};

export type ApiAttribute = {
  id: number;
  code: string;
  name: string;
};

export type ApiAttributeOption = {
  id: number;
  label: string;
  value: string;
};

export type ApiAttributeValue = {
  attribute_id: number;
  attribute?: ApiAttribute;
  option?: ApiAttributeOption | null;
  value_text?: string | null;
  value_varchar?: string | null;
};

/** From GET /filters/attributes — filterable select attributes + options */
export type FilterOptionRow = {
  id: number;
  label: string;
  value: string;
  sort_order: number;
};

export type FilterableAttribute = {
  id: number;
  name: string;
  code: string;
  type: string;
  sort_order: number;
  options: FilterOptionRow[];
};

export type ApiProduct = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku?: string | null;
  base_price: string | number;
  sale_price?: string | number | null;
  stock_qty?: number;
  is_active?: boolean;
  category?: { id: number; name: string; slug?: string };
  images?: ApiProductImage[];
  attribute_values?: ApiAttributeValue[];
  /** Some serializers may emit camelCase */
  attributeValues?: ApiAttributeValue[];
};

export function attributeValuesList(product: ApiProduct): ApiAttributeValue[] {
  const raw = product as Record<string, unknown>;
  const v =
    product.attribute_values ??
    product.attributeValues ??
    raw.attribute_values ??
    raw.attributeValues;
  return Array.isArray(v) ? (v as ApiAttributeValue[]) : [];
}

const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  olive: "#556b2f",
  navy: "#001f3f",
  "brown-plaid": "#6b4423",
  grey: "#808080",
  indigo: "#3f5277",
  khaki: "#c3b091",
};

export function optionLabelToHex(label: string): string {
  const key = label.trim().toLowerCase().replace(/\s+/g, "-");
  return COLOR_HEX[key] ?? "#d1d5db";
}

export function formatPrice(
  base: string | number,
  sale?: string | number | null,
): string {
  const saleNum =
    sale !== undefined && sale !== null && sale !== "" ? Number(sale) : null;
  const baseNum = Number(base);
  const price = saleNum !== null && !Number.isNaN(saleNum) ? saleNum : baseNum;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function primaryImageUrlFromApi(product: ApiProduct): string {
  const imgs = product.images ?? [];
  if (imgs.length === 0) {
    return "https://placehold.co/600x600?text=No+Image";
  }
  const sorted = [...imgs].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  return sorted[0].image_url;
}

function colorHexSwatches(product: ApiProduct): string[] {
  const values = attributeValuesList(product);
  for (const v of values) {
    if (v.attribute?.code === "color" && v.option?.label) {
      return [optionLabelToHex(v.option.label)];
    }
  }
  return ["#d1d5db"];
}

export function mapApiProductToPlp(product: ApiProduct): PlProduct {
  return {
    id: product.id,
    name: product.name,
    price: formatPrice(product.base_price, product.sale_price ?? null),
    image: primaryImageUrlFromApi(product),
    colors: colorHexSwatches(product),
    isNew: product.id >= 6,
  };
}

export type PdpColor = { name: string; value: string };

export function colorsForPdp(product: ApiProduct): PdpColor[] {
  const values = attributeValuesList(product);
  for (const v of values) {
    if (v.attribute?.code === "color" && v.option?.label) {
      const name = v.option.label;
      return [{ name, value: optionLabelToHex(name) }];
    }
  }
  return [{ name: "Default", value: "#d1d5db" }];
}

export function sizesForPdp(product: ApiProduct): string[] {
  const values = attributeValuesList(product);
  const codes = new Set(["size", "waist", "inseam"]);
  const found: string[] = [];
  for (const v of values) {
    const code = v.attribute?.code;
    if (code && codes.has(code) && v.option?.label) {
      found.push(v.option.label);
    }
  }
  return found;
}

export function descriptionText(product: ApiProduct): string {
  const values = attributeValuesList(product);
  for (const v of values) {
    if (v.attribute?.code === "description" && v.value_text) {
      return v.value_text;
    }
  }
  return "";
}

export function careText(product: ApiProduct): string {
  const values = attributeValuesList(product);
  for (const v of values) {
    if (v.attribute?.code === "care" && v.value_text) {
      return v.value_text;
    }
  }
  return "";
}

export function materialText(product: ApiProduct): string {
  const values = attributeValuesList(product);
  for (const v of values) {
    if (v.attribute?.code === "material" && v.value_varchar) {
      return v.value_varchar;
    }
  }
  return "";
}

export function galleryImages(
  product: ApiProduct,
): Array<{ url: string; alt: string }> {
  const imgs = product.images ?? [];
  return [...imgs]
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .map((im) => ({
      url: im.image_url,
      alt: im.alt_text ?? product.name,
    }));
}

export function unitPriceCents(product: ApiProduct): number {
  const sale = product.sale_price;
  const base = product.base_price;
  const saleNum =
    sale !== undefined && sale !== null && sale !== "" ? Number(sale) : null;
  const baseNum = Number(base);
  const price = saleNum !== null && !Number.isNaN(saleNum) ? saleNum : baseNum;
  return Math.round(price * 100);
}
