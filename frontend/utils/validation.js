export function isRequired(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidName(value) {
  return /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(value.trim());
}

export function isValidPassword(value) {
  return typeof value === "string" && value.length >= 4 && value.length <= 8;
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

export function isValidOtp(value) {
  return /^\d{6}$/.test(value);
}
