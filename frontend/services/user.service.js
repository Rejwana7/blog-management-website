import { apiRequest } from "@/utils/api";

export const userService = {
  getProfile: () => apiRequest("/api/profile"),
  updateProfile: (payload) => apiRequest("/api/profile/update", { method: "PUT", body: JSON.stringify(payload) }),
  changePassword: (payload) => apiRequest("/api/password", { method: "PATCH", body: JSON.stringify(payload) }),
  getAll: () => apiRequest("/api/users"),
};
