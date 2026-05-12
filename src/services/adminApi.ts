import apiClient, { unwrapData, type ApiEnvelope } from "./api";
import type {
  AdminCategory,
  AdminCategoryListPayload,
  AdminEavAttribute,
  AdminEavOption,
  AdminProduct,
  AdminProductEavRow,
  AdminProductImage,
  AdminUserListPayload,
} from "../types/admin";

async function get<T>(path: string): Promise<T> {
  const res = await apiClient.get<ApiEnvelope<T>>(path);
  return unwrapData(res.data);
}

async function del(path: string): Promise<void> {
  const res = await apiClient.delete<ApiEnvelope<null>>(path);
  unwrapData(res.data);
}

export async function adminFetchCategories(
  shallow = true,
): Promise<AdminCategoryListPayload> {
  const q = shallow ? "?shallow=1" : "";
  return get<AdminCategoryListPayload>(`/categories${q}`);
}

export async function adminFetchCategory(id: number): Promise<AdminCategory> {
  return get<AdminCategory>(`/categories/${id}`);
}

export async function adminCreateCategory(
  body: Partial<AdminCategory> & { name: string },
): Promise<AdminCategory> {
  const res = await apiClient.post<ApiEnvelope<AdminCategory>>(
    "/categories",
    body,
  );
  return unwrapData(res.data);
}

export async function adminUpdateCategory(
  id: number,
  body: Partial<AdminCategory>,
): Promise<AdminCategory> {
  const res = await apiClient.put<ApiEnvelope<AdminCategory>>(
    `/categories/${id}`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminDeleteCategory(id: number): Promise<void> {
  await del(`/categories/${id}`);
}

export async function adminFetchCategoryAttributes(
  categoryId: number,
): Promise<AdminEavAttribute[]> {
  return get<AdminEavAttribute[]>(`/categories/${categoryId}/attributes`);
}

export async function adminSyncCategoryAttributes(
  categoryId: number,
  attributes: Array<{ attribute_id: number; sort_order?: number }>,
): Promise<AdminEavAttribute[]> {
  const res = await apiClient.put<ApiEnvelope<AdminEavAttribute[]>>(
    `/categories/${categoryId}/attributes`,
    { attributes },
  );
  return unwrapData(res.data);
}

export async function adminFetchProducts(opts?: {
  category_id?: number;
  search?: string;
  is_active?: boolean;
}): Promise<AdminProduct[]> {
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
  const q = sp.toString();
  return get<AdminProduct[]>(q ? `/products?${q}` : "/products");
}

export async function adminFetchProduct(id: number): Promise<AdminProduct> {
  return get<AdminProduct>(`/products/${id}`);
}

export async function adminCreateProduct(
  body: Record<string, unknown>,
): Promise<AdminProduct> {
  const res = await apiClient.post<ApiEnvelope<AdminProduct>>(
    "/products",
    body,
  );
  return unwrapData(res.data);
}

export async function adminUpdateProduct(
  id: number,
  body: Record<string, unknown>,
): Promise<AdminProduct> {
  const res = await apiClient.put<ApiEnvelope<AdminProduct>>(
    `/products/${id}`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminDeleteProduct(id: number): Promise<void> {
  await del(`/products/${id}`);
}

export async function adminFetchProductImages(
  productId: number,
): Promise<AdminProductImage[]> {
  return get<AdminProductImage[]>(`/products/${productId}/images`);
}

export async function adminCreateProductImage(
  productId: number,
  body: Pick<AdminProductImage, "image_url"> &
    Partial<Pick<AdminProductImage, "alt_text" | "sort_order" | "is_primary">>,
): Promise<AdminProductImage> {
  const res = await apiClient.post<ApiEnvelope<AdminProductImage>>(
    `/products/${productId}/images`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminUpdateProductImage(
  productId: number,
  imageId: number,
  body: Partial<AdminProductImage>,
): Promise<AdminProductImage> {
  const res = await apiClient.put<ApiEnvelope<AdminProductImage>>(
    `/products/${productId}/images/${imageId}`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminDeleteProductImage(
  productId: number,
  imageId: number,
): Promise<void> {
  await del(`/products/${productId}/images/${imageId}`);
}

export async function adminFetchProductEavValues(
  productId: number,
): Promise<AdminProductEavRow[]> {
  return get<AdminProductEavRow[]>(`/products/${productId}/eav-values`);
}

export async function adminSyncProductEavValues(
  productId: number,
  values: Array<Record<string, unknown>>,
): Promise<AdminProductEavRow[]> {
  const res = await apiClient.put<ApiEnvelope<AdminProductEavRow[]>>(
    `/products/${productId}/eav-values`,
    { values },
  );
  return unwrapData(res.data);
}

export async function adminFetchEavAttributes(): Promise<AdminEavAttribute[]> {
  return get<AdminEavAttribute[]>("/eav-attributes");
}

export async function adminFetchEavAttribute(
  id: number,
): Promise<AdminEavAttribute> {
  return get<AdminEavAttribute>(`/eav-attributes/${id}`);
}

export async function adminCreateEavAttribute(
  body: Record<string, unknown>,
): Promise<AdminEavAttribute> {
  const res = await apiClient.post<ApiEnvelope<AdminEavAttribute>>(
    "/eav-attributes",
    body,
  );
  return unwrapData(res.data);
}

export async function adminUpdateEavAttribute(
  id: number,
  body: Record<string, unknown>,
): Promise<AdminEavAttribute> {
  const res = await apiClient.put<ApiEnvelope<AdminEavAttribute>>(
    `/eav-attributes/${id}`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminDeleteEavAttribute(id: number): Promise<void> {
  await del(`/eav-attributes/${id}`);
}

export async function adminCreateEavOption(
  attributeId: number,
  body: Pick<AdminEavOption, "label" | "value"> &
    Partial<Pick<AdminEavOption, "sort_order">>,
): Promise<AdminEavOption> {
  const res = await apiClient.post<ApiEnvelope<AdminEavOption>>(
    `/eav-attributes/${attributeId}/options`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminUpdateEavOption(
  attributeId: number,
  optionId: number,
  body: Partial<AdminEavOption>,
): Promise<AdminEavOption> {
  const res = await apiClient.put<ApiEnvelope<AdminEavOption>>(
    `/eav-attributes/${attributeId}/options/${optionId}`,
    body,
  );
  return unwrapData(res.data);
}

export async function adminDeleteEavOption(
  attributeId: number,
  optionId: number,
): Promise<void> {
  await del(`/eav-attributes/${attributeId}/options/${optionId}`);
}

export async function adminFetchUsers(): Promise<AdminUserListPayload> {
  return get<AdminUserListPayload>("/users");
}
