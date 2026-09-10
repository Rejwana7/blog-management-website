import { apiRequest } from "@/utils/api";

export const userService = {
  getProfile: () => apiRequest("/api/profile"),
  updateProfile: (payload) => apiRequest("/api/profile/update", { method: "PUT", body: JSON.stringify(payload) }),
  uploadProfileImage: (image) => {
    const formData = new FormData();
    formData.append("image", image);
    return apiRequest("/api/profile/image", { method: "PATCH", body: formData });
  },
  changePassword: (payload) => apiRequest("/api/users/password", { method: "PATCH", body: JSON.stringify(payload) }),
  getAll: ({ page = 1, limit = 10 } = {}) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiRequest(`/api/users?${query.toString()}`, { cache: "no-store" });
  },
  getById: (id) => apiRequest(`/api/users/${encodeURIComponent(id)}`, { cache: "no-store" }),
  updateStatus: (id, isActive) => apiRequest(`/api/users/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  }),
};
