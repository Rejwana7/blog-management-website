import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function getAssetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message ?? "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}
