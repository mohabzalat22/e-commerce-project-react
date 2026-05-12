import axios from "axios";
import type { ApiProduct, FilterableAttribute } from "../types/catalog";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ?? "http://localhost:8000/api/v1.0.0";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  status_code?: number;
};

export function unwrapData<T>(payload: ApiEnvelope<T>): T {
  if (!payload.success || payload.data === undefined) {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data;
}

export const fetchProducts = async (opts?: {
  category_id?: number;
  search?: string;
  is_active?: boolean;
  /** EAV select filters; values are option ids (or labels/values accepted by API) */
  attributes?: Record<string, string[]>;
}): Promise<ApiProduct[]> => {
  const sp = new URLSearchParams();
  if (opts?.category_id !== undefined) {
    sp.set("category_id", String(opts.category_id));
  }
  if (opts?.search) {
    sp.set("search", opts.search);
  }
  if (opts?.is_active !== undefined) {
    sp.set("is_active", opts.is_active ? "true" : "false");
  }
  if (opts?.attributes) {
    for (const [code, ids] of Object.entries(opts.attributes)) {
      for (const id of ids) {
        sp.append(`attributes[${code}][]`, id);
      }
    }
  }
  const q = sp.toString();
  const path = q ? `/products?${q}` : "/products";
  const response = await apiClient.get<ApiEnvelope<ApiProduct[]>>(path);
  return unwrapData(response.data);
};

export type CategoryFilterItem = { id: number; name: string };

export const fetchCategoryFilters = async () => {
  const response = await apiClient.get<ApiEnvelope<CategoryFilterItem[]>>(
    "/filters/categories",
  );
  return unwrapData(response.data);
};

export const fetchFilterableAttributes = async (
  categoryId?: number,
): Promise<FilterableAttribute[]> => {
  const path =
    categoryId !== undefined
      ? `/filters/attributes?category_id=${encodeURIComponent(String(categoryId))}`
      : "/filters/attributes";
  const response = await apiClient.get<ApiEnvelope<FilterableAttribute[]>>(
    path,
  );
  return unwrapData(response.data);
};

export const fetchColorFilters = async () => {
  const response = await apiClient.get<ApiEnvelope<string[]>>(
    "/filters/colors",
  );
  return unwrapData(response.data);
};

export const fetchSizeFilters = async () => {
  const response = await apiClient.get<ApiEnvelope<string[]>>(
    "/filters/sizes",
  );
  return unwrapData(response.data);
};

export const fetchProduct = async (id: number) => {
  const response = await apiClient.get<ApiEnvelope<ApiProduct>>(
    `/products/${id}`,
  );
  return unwrapData(response.data);
};

export const fetchRelatedProducts = async (productId: number) => {
  const response = await apiClient.get<ApiEnvelope<ApiProduct[]>>(
    `/products/${productId}/related`,
  );
  return unwrapData(response.data);
};

export type StorefrontHome = {
  categories: Array<{
    id: number;
    name: string;
    slug?: string;
    image_url?: string | null;
    description?: string | null;
  }>;
  featured_products: ApiProduct[];
};

export const fetchStorefrontHome = async () => {
  const response = await apiClient.get<ApiEnvelope<StorefrontHome>>(
    "/storefront/home",
  );
  return unwrapData(response.data);
};

export type PlaceOrderShipping = {
  email: string;
  full_name: string;
  address_line1: string;
  city: string;
  postal_code: string;
};

export type PlaceOrderLine = {
  product_id: number;
  name: string;
  image_url: string;
  unit_price_cents: number;
  quantity: number;
  size_label: string;
  color_label: string;
};

export type PlaceOrderPayload = {
  shipping: PlaceOrderShipping;
  lines: PlaceOrderLine[];
};

export type PlacedOrder = {
  id: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
};

export const placeOrder = async (
  payload: PlaceOrderPayload,
): Promise<PlacedOrder> => {
  const response = await apiClient.post<ApiEnvelope<PlacedOrder>>(
    "/orders",
    payload,
  );
  return unwrapData(response.data);
};

export default apiClient;
