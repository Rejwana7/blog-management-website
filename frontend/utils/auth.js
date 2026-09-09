const TOKEN_KEY = "blog_management_token";

export function getToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
