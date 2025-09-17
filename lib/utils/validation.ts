/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Chilean RUT
 */
export function isValidRut(rut: string): boolean {
  const cleanRut = rut.replace(/[.-]/g, '');

  if (cleanRut.length < 8 || cleanRut.length > 9) {
    return false;
  }

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

  return dv === calculatedDv;
}

/**
 * Validate phone number (Chilean format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+?56)?[ -]?9[ -]?[0-9]{4}[ -]?[0-9]{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Check if value is not empty
 */
export function isNotEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}