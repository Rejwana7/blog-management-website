import { apiRequest } from "@/utils/api";

export const userService = {
  getProfile: () => apiRequest("/api/profile"),
  updateProfile: (payload) => apiRequest("/api/profile/update", { method: "PUT", body: JSON.stringify(payload) }),
  uploadProfileImage: (image) => {
    const formData = new FormData();
    formData.append("image", image);
    return apiRequest("/api/profile/image", { method: "PATCH", body: formData });
  },
  changePassword: (payload) => apiRequest("/api/password", { method: "PATCH", body: JSON.stringify(payload) }),
  getAll: () => apiRequest("/api/users"),
};
