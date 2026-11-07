// Login history and user activity tracking (Dashboard → Login History / User Activity).
// Writing a log must never break the request that triggered it, so record* functions swallow errors.
import LoginLog from '@/models/LoginLog';
import ActivityLog from '@/models/ActivityLog';
import User from '@/models/User';
import { getClientIp } from '@/lib/visitor';
import { parseUserAgent } from '@/lib/user-agent';
import { contains, q } from '@/lib/table';
import { str, toPlain } from '@/server/validate';

// Where the request came from — IP, country/city (Vercel headers) and the device
function requestContext(req) {
  const ua = req.headers.get('user-agent') || '';
  let city = req.headers.get('x-vercel-ip-city') || '';
  try {
    city = decodeURIComponent(city);
  } catch {
    /* keep raw value */
  }
  return {
    ip: getClientIp(req),
    country: req.headers.get('x-vercel-ip-country') || '',
    city,
    userAgent: ua.slice(0, 400),
    ...parseUserAgent(ua),
  };
}

// ---------- recording ----------

// Logs are kept for 180 days; old rows are cleared at most once an hour per server process
const KEEP_DAYS = 180;
let prunedAt = 0;
function pruneOldLogs() {
  if (Date.now() - prunedAt < 60 * 60 * 1000) return;
  prunedAt = Date.now();
  const before = [new Date(Date.now() - KEEP_DAYS * 86400000)];
  Promise.all([LoginLog.deleteWhere('`createdAt` < ?', before), ActivityLog.deleteWhere('`createdAt` < ?', before)]).catch((error) =>
    console.error('Log cleanup failed:', error.message)
  );
}

export async function recordLogin(req, { email, success, reason = '', user }) {
  try {
    const account = user || (email ? await User.findOne({ email: str(email, 160).toLowerCase() }, [], { columns: ['name', 'role'] }) : null);
    await LoginLog.insert({
      ...requestContext(req),
      email: str(email, 160).toLowerCase(),
      success,
      reason,
      ...(account && { user: account._id, name: account.name, role: account.role }),
    });
  } catch (error) {
    console.error('Login log failed:', error.message);
  }
  pruneOldLogs();
}

export async function recordActivity(req, { session, user, action, entity = '', entityId = '', summary = '' }) {
  try {
    const actor = user || session;
    const { userAgent, city, ...ctx } = requestContext(req);
    await ActivityLog.insert({
      ...ctx,
      user: actor?._id,
      name: actor?.name || '',
      email: actor?.email || '',
      role: actor?.role || '',
      action,
      entity,
      entityId: String(entityId || ''),
      summary: str(summary, 300),
      method: req.method,
      path: new URL(req.url).pathname,
    });
  } catch (error) {
    console.error('Activity log failed:', error.message);
  }
}

// Turns an API change (method + path + response data) into an activity entry
const ENTITIES = [
  [/^\/api\/settings\/site/, 'Site settings'],
  [/^\/api\/settings\/seo/, 'SEO settings'],
  [/^\/api\/settings\/email/, 'Email settings'],
  [/^\/api\/reports\/send/, 'Report'],
  [/^\/api\/email\/test/, 'Test email'],
  [/^\/api\/contact/, 'Contact message'],
  [/^\/api\/product-categories/, 'Product category'],
  [/^\/api\/media/, 'Image'],
  [/^\/api\/products/, 'Product'],
  [/^\/api\/blog/, 'Blog post'],
  [/^\/api\/team/, 'Team member'],
  [/^\/api\/clients/, 'Client'],
];
const VERBS = { create: 'Created', update: 'Updated', delete: 'Deleted' };

export function describeChange(method, path, data) {
  if (path.startsWith('/api/auth/logout')) return { action: 'logout', entity: 'Session', summary: 'Signed out' };
  if (path.startsWith('/api/auth/password')) return { action: 'password_change', entity: 'Password', summary: 'Changed their password' };
  const entity = ENTITIES.find(([re]) => re.test(path))?.[1];
  if (!entity) return null;
  const action = method === 'POST' ? 'create' : method === 'DELETE' ? 'delete' : 'update';
  const d = data && typeof data === 'object' ? data : {};
  const label = d.title || d.name || d.fullName || '';
  const extra = entity === 'Site settings' && d.timezone ? `timezone: ${d.timezone}` : '';
  const id = d._id || path.split('/')[3] || '';
  return {
    action,
    entity,
    entityId: id,
    summary: `${VERBS[action]} ${entity.toLowerCase()}${label ? ` “${label}”` : ''}${extra ? ` (${extra})` : ''}`,
  };
}

// ---------- reading (admin) ----------

const since = (days) => (Number(days) > 0 ? new Date(Date.now() - Number(days) * 86400000) : null);

// Adds the shared filters to conds/params and returns [where, params]
function filters({ role, days, search, searchColumns }, conds = [], params = []) {
  if (role) {
    conds.push('`role` = ?');
    params.push(role);
  }
  const from = since(days);
  if (from) {
    conds.push('`createdAt` >= ?');
    params.push(from);
  }
  if (search) {
    conds.push(`(${searchColumns.map((c) => `${q(c)} LIKE ?`).join(' OR ')})`);
    params.push(...searchColumns.map(() => contains(search)));
  }
  return [conds.join(' AND '), params];
}

// Everything except the full browser string
const LOGIN_COLUMNS = ['user', 'email', 'name', 'role', 'success', 'reason', 'ip', 'country', 'city', 'browser', 'os', 'device', 'createdAt'];

export async function listLogins({ result, role, search, days } = {}) {
  const conds = [];
  if (result === 'success') conds.push('`success` = 1');
  if (result === 'failed') conds.push('`success` = 0');
  const [where, params] = filters({ role, days, search, searchColumns: ['email', 'name', 'ip', 'country', 'browser'] }, conds);
  return toPlain(await LoginLog.find({ where, params, columns: LOGIN_COLUMNS, orderBy: { createdAt: -1 }, limit: 1000 }));
}

export async function listActivity({ action, entity, role, search, days, user } = {}) {
  const conds = [];
  const params = [];
  for (const [col, value] of Object.entries({ action, entity, user })) {
    if (value) {
      conds.push(`${q(col)} = ?`);
      params.push(value);
    }
  }
  const [where] = filters({ role, days, search, searchColumns: ['email', 'name', 'summary', 'ip'] }, conds, params);
  return toPlain(await ActivityLog.find({ where, params, orderBy: { createdAt: -1 }, limit: 1000 }));
}

export async function loginStats() {
  const day = [since(1)];
  const [today, failedToday, activeUsers7d, total] = await Promise.all([
    LoginLog.count('`success` = 1 AND `createdAt` >= ?', day),
    LoginLog.count('`success` = 0 AND `createdAt` >= ?', day),
    LoginLog.distinctCount('user', '`success` = 1 AND `createdAt` >= ?', [since(7)]),
    LoginLog.count(),
  ]);
  return { today, failedToday, activeUsers7d, total };
}

export async function activityStats() {
  const [today, activeUsers7d, byAction] = await Promise.all([
    ActivityLog.count('`createdAt` >= ?', [since(1)]),
    ActivityLog.distinctCount('user', '`createdAt` >= ?', [since(7)]),
    ActivityLog.countBy('action', '`createdAt` >= ?', [since(30)]),
  ]);
  return { today, activeUsers7d, last30d: Object.fromEntries(byAction.map((r) => [r._id, r.count])) };
}
