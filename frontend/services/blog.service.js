import { apiRequest } from "@/utils/api";

export const blogService = {
  getAll: ({ title = "", category = "" } = {}) => {
    const query = new URLSearchParams();
    if (title) query.set("title", title);
    if (category) query.set("category", category);
    const queryString = query.toString();
    return apiRequest(`/api/blogs${queryString ? `?${queryString}` : ""}`, { cache: "no-store" });
  },
  getById: (id) => apiRequest(`/api/blogs/${id}`, { cache: "no-store" }),
  create: (payload) => apiRequest("/api/blogs/create", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => apiRequest(`/api/blogs/update/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => apiRequest(`/api/blogs/${id}`, { method: "DELETE" }),
};
