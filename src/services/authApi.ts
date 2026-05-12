/**
 * Storefront auth: PHP ecom API (`User` model + session).
 * Uses the same base URL as the catalog API (`REACT_APP_API_URL`).
 */
const API_BASE = (
  process.env.REACT_APP_API_URL ?? "http://localhost:8000/api/v1.0.0"
).replace(/\/$/, "");

function apiUrl(path: string): string {
  const p = path.replace(/^\//, "");
  return `${API_BASE}/${p}`;
}

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  /** When present, used for admin route protection (e.g. `"admin"`). */
  role?: string | null;
};

export function isAdminRole(user: AuthUser | null | undefined): boolean {
  const r = user?.role;
  if (r == null || r === "") return false;
  return String(r).toLowerCase() === "admin";
}

type Envelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  status_code?: number;
};

export type SessionPayload =
  | { authenticated: false }
  | { authenticated: true; user: AuthUser };

function unwrapUser(payload: Envelope<{ user: AuthUser }>): AuthUser {
  if (!payload.success || !payload.data?.user) {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data.user;
}

export async function signupRequest(
  name: string,
  email: string,
  password: string,
  remember = false,
): Promise<AuthUser> {
  const res = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, remember }),
  });
  const json = (await res.json()) as Envelope<{ user: AuthUser }>;
  if (!res.ok) {
    throw new Error(json.message ?? "Sign up failed");
  }
  return unwrapUser(json);
}

export async function loginRequest(
  email: string,
  password: string,
  remember = false,
): Promise<AuthUser> {
  const res = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });
  const json = (await res.json()) as Envelope<{ user: AuthUser }>;
  if (!res.ok) {
    throw new Error(json.message ?? "Login failed");
  }
  return unwrapUser(json);
}

export async function sessionRequest(): Promise<SessionPayload> {
  const res = await fetch(apiUrl("/auth/session"), {
    method: "GET",
    credentials: "include",
  });
  const json = (await res.json()) as Envelope<SessionPayload>;
  if (!json.success || !json.data) {
    return { authenticated: false };
  }
  return json.data;
}

export async function logoutRequest(): Promise<void> {
  await fetch(apiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
}
