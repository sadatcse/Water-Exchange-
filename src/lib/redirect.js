// Where to send someone after they sign in.
// `from` must be a path on this site (never another domain), and only admins may return to /dashboard.
export function safeRedirect(from, role, fallback) {
  if (!from || typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//') || from.startsWith('/\\')) return fallback;
  if (from.startsWith('/dashboard') && role !== 'admin') return fallback;
  if (from.startsWith('/admin')) return fallback;
  return from;
}
