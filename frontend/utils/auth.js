const TOKEN_KEY = "blog_management_token";
const PENDING_EMAIL_KEY = "blog_management_pending_email";

export function getToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getPendingLoginEmail() {
  return typeof window === "undefined" ? null : window.sessionStorage.getItem(PENDING_EMAIL_KEY);
}

export function setPendingLoginEmail(email) {
  window.sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function removePendingLoginEmail() {
  window.sessionStorage.removeItem(PENDING_EMAIL_KEY);
}
