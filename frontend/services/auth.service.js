import { apiRequest } from "@/utils/api";

export const authService = {
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  forgotPassword: (payload) => apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  verifyOtp: (payload) => apiRequest("/auth/verify-otp", { method: "POST", body: JSON.stringify(payload) }),
  resetPassword: (token, payload) => apiRequest(`/auth/reset-password/${token}`, { method: "PATCH", body: JSON.stringify(payload) }),
};
