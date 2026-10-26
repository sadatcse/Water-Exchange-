import { ok, readJson, HttpError } from '@/server/http';
import * as settings from '@/server/services/settings.service';

// GET /api/settings/site|seo → anyone · GET /api/settings/email → admins only
export async function show({ params, session }) {
  if (!settings.PUBLIC_KEYS.includes(params.key) && session?.role !== 'admin') throw new HttpError(401, 'Please sign in.');
  return ok(await settings.getSetting(params.key));
}

// PUT /api/settings/:key → admins only
export async function update({ req, params, session }) {
  return ok(await settings.updateSetting(params.key, await readJson(req), { userId: session._id }), 'Saved.');
}
