import { getTimeZone } from './timezone';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Date (and optional time) in the site timezone set in Dashboard → Settings
export function formatDate(value, withTime = false) {
  if (!value) return '—';
  const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: getTimeZone() };
  if (withTime) Object.assign(options, { hour: '2-digit', minute: '2-digit' });
  return new Date(value).toLocaleString('en-GB', options);
}
