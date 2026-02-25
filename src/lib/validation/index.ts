export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (v: string) => EMAIL_REGEX.test(v.trim());
export const isValidBirthYear = (v: number) => v >= 1900 && v <= new Date().getFullYear() - 14;
export const isValidPassword = (v: string) => v.length >= 8 && v.length <= 100;
