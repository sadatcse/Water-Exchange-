// Encrypts small secrets (the SMTP password) before they are stored in MongoDB. Server-only.
// AES-256-GCM with a key derived from SETTINGS_SECRET (falls back to JWT_SECRET). Keep SETTINGS_SECRET
// stable: if it changes, saved secrets can no longer be read and must be entered again.
import crypto from 'node:crypto';

function key() {
  const secret = process.env.SETTINGS_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('SETTINGS_SECRET (or JWT_SECRET) is not set.');
  return crypto.createHash('sha256').update(`settings:${secret}`).digest();
}

// → "v1:<iv>:<tag>:<ciphertext>" (base64url parts)
export function seal(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  return ['v1', iv, cipher.getAuthTag(), data].map((p) => (typeof p === 'string' ? p : p.toString('base64url'))).join(':');
}

// Returns the plain text, or '' when the value is missing or cannot be decrypted
export function open(sealed) {
  if (!sealed || typeof sealed !== 'string') return '';
  try {
    const [version, iv, tag, data] = sealed.split(':');
    if (version !== 'v1') return '';
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}
