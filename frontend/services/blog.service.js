import { apiRequest } from "@/utils/api";

export const blogService = {
  getAll: () => apiRequest("/api/blogs", { cache: "no-store" }),
  getById: (id) => apiRequest(`/api/blogs/${id}`, { cache: "no-store" }),
  create: (payload) => apiRequest("/api/blogs/create", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => apiRequest(`/api/blogs/update/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => apiRequest(`/api/blogs/${id}`, { method: "DELETE" }),
};
