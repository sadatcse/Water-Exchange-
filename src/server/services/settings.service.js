// Dashboard-editable site settings (Setting model). Currently: site (timezone).
// Reads merge the stored value over DEFAULTS, so a missing document still works.
import connectDB from '@/lib/db';
import Setting from '@/models/Setting';
import { HttpError } from '@/server/http';
import { str, toPlain } from '@/server/validate';
import { DEFAULT_TIME_ZONE, isValidTimeZone } from '@/lib/timezone';

export const DEFAULTS = {
  site: {
    timezone: DEFAULT_TIME_ZONE,
  },
};

const KEYS = Object.keys(DEFAULTS);

const CLEANERS = {
  site: (input) => {
    const timezone = str(input.timezone, 60);
    if (!isValidTimeZone(timezone)) throw new HttpError(400, 'Choose a valid timezone.');
    return { timezone };
  },
};

// Short in-memory cache for the site settings read by every page (app/layout.jsx)
const CACHE_MS = 60 * 1000;
const cache = new Map();

export async function getCachedSetting(key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await getSetting(key);
  cache.set(key, { value, expires: Date.now() + CACHE_MS });
  return value;
}

export async function getSetting(key) {
  if (!KEYS.includes(key)) throw new HttpError(404, 'Unknown setting.');
  await connectDB();
  const doc = await Setting.findOne({ key }).lean();
  return toPlain({ ...DEFAULTS[key], ...(doc?.value || {}) });
}

export async function updateSetting(key, input = {}, { userId } = {}) {
  if (!KEYS.includes(key)) throw new HttpError(404, 'Unknown setting.');
  const value = CLEANERS[key](input);
  await connectDB();
  await Setting.updateOne({ key }, { $set: { value, updatedBy: userId } }, { upsert: true });
  cache.delete(key);
  return getSetting(key);
}
