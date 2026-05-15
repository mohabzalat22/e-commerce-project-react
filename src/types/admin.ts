/** Admin / API shapes (mostly snake_case from Eloquent JSON). */

export type AdminCategory = {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  image_url?: string | null;
  description?: string | null;
  is_active?: boolean;
  sort_order?: number;
  children?: AdminCategory[];
  products?: unknown[];
};

export type AdminCategoryListPayload = {
  items: AdminCategory[];
  count: number;
};

export type AdminProduct = {
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
};

export type AdminProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type AdminEavAttribute = {
  id: number;
  name: string;
  code: string;
  type: string;
  is_required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  sort_order: number;
  options?: AdminEavOption[];
};

export type AdminEavOption = {
  id: number;
  attribute_id: number;
  label: string;
  value: string;
  sort_order: number;
};

export type AdminProductEavRow = {
  id?: number;
  product_id: number;
  attribute_id: number;
  option_id?: number | null;
  value_varchar?: string | null;
  value_text?: string | null;
  value_int?: number | null;
  value_decimal?: string | number | null;
  value_datetime?: string | null;
  attribute?: AdminEavAttribute;
  option?: AdminEavOption | null;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
};

export type AdminUserListPayload = {
  items: AdminUser[];
  count: number;
};

export type AdminOrderItem = {
  id: number;
  order_id: string;
  product_id: number;
  name: string;
  image_url: string;
  unit_price_cents: number;
  quantity: number;
  size_label: string;
  color_label: string;
  line_total_cents: number;
};

export type AdminOrder = {
  id: string;
  email: string;
  full_name: string;
  address_line1: string;
  city: string;
  postal_code: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status?: string;
  created_at?: string | null;
  updated_at?: string | null;
  items_count?: number;
  items?: AdminOrderItem[];
};

export type AdminOrderListPayload = {
  items: AdminOrder[];
  count: number;
};

export type AdminTaxSettings = {
  tax_enabled: boolean;
  tax_rate_percent: number;
  tax_enabled_key: string;
};
