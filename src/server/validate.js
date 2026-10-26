// Input helpers for request bodies and responses.
export const str = (value, max = 500) => (value === undefined || value === null ? '' : String(value).trim().slice(0, max));

// Lean Mongoose docs → plain JSON (ObjectIds and Dates become strings) for client components
export const toPlain = (value) => JSON.parse(JSON.stringify(value));

export const bool = (value, fallback = false) => (value === undefined ? fallback : value === true || value === 'true');

export const num = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

// Array of trimmed, non-empty strings
export const strList = (value, { maxItems = 50, max = 500 } = {}) =>
  (Array.isArray(value) ? value : []).map((v) => str(v, max)).filter(Boolean).slice(0, maxItems);

// Array of { label, value } with both parts filled in
export const pairList = (value, maxItems = 40) =>
  (Array.isArray(value) ? value : [])
    .map((p) => ({ label: str(p?.label, 80), value: str(p?.value, 200) }))
    .filter((p) => p.label && p.value)
    .slice(0, maxItems);

// "Roots Air Blower" → "roots-air-blower"
export const slugify = (value) =>
  str(value, 200)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

// Local path ("/images/…") or an http(s) URL; anything else is rejected
export const imageUrl = (value) => {
  const v = str(value, 600);
  if (!v) return '';
  if (v.startsWith('/') && !v.startsWith('//')) return v;
  try {
    const url = new URL(v);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
};

// Server-side pagination params (?page=&limit=)
export function pageParams(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, Math.floor(num(query.get('page'), 1)));
  const limit = Math.min(maxLimit, Math.max(1, Math.floor(num(query.get('limit'), defaultLimit))));
  return { page, limit, skip: (page - 1) * limit };
}
