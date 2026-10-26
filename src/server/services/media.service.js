// Image uploads stored on the server's disk (cPanel friendly — no cloud storage or image library needed).
// Files go to UPLOAD_DIR (default: ./uploads; on cPanel app.js points it to <app root>/uploads, outside the
// deployed site/ folder so updates never delete them) and are served by app/uploads/[...path]/route.js.
// Images are resized and compressed in the browser before upload (src/lib/image-compress.js).
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import connectDB from '@/lib/db';
import Media from '@/models/Media';
import Product from '@/models/Product';
import BlogPost from '@/models/BlogPost';
import TeamMember from '@/models/TeamMember';
import Client from '@/models/Client';
import Setting from '@/models/Setting';
import { HttpError } from '@/server/http';
import { escapeRegex } from '@/lib/utils';
import { slugify, toPlain } from '@/server/validate';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const EXT = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif' };

// The ignore comments keep Next's file tracing from copying the whole project into the build (the folder is
// only known at runtime)
export const uploadDir = () => path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), 'uploads'));

// The real type from the first bytes — the browser's claimed type and the file name are not trusted.
// SVG is not accepted (it can contain scripts).
function sniffType(buf) {
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.length >= 8 && buf.readUInt32BE(0) === 0x89504e47) return 'image/png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length >= 6 && ['GIF87a', 'GIF89a'].includes(buf.toString('ascii', 0, 6))) return 'image/gif';
  return null;
}

// Pixel size read from the file header (no image library needed)
function dimensions(buf, type) {
  try {
    if (type === 'image/png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (type === 'image/gif') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    if (type === 'image/webp') {
      const chunk = buf.toString('ascii', 12, 16);
      if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (chunk === 'VP8L') {
        const b = buf.readUInt32LE(21);
        return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) };
      }
      if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (type === 'image/jpeg') {
      // Walk the segments to the first start-of-frame marker
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) break;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
        i += 2 + len;
      }
    }
  } catch {
    /* unreadable header — size stays unknown */
  }
  return { width: 0, height: 0 };
}

// file: a File from request.formData()
export async function saveUpload(file, { userId } = {}) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new HttpError(400, 'Choose an image to upload.');
  if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, `The image is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniffType(buf);
  if (!type) throw new HttpError(415, 'Only JPG, PNG, WebP or GIF images can be uploaded.');

  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const base = slugify(String(file.name || 'image').replace(/\.[a-z0-9]+$/i, '')).slice(0, 60) || 'image';
  const rel = `${folder}/${base}-${crypto.randomBytes(4).toString('hex')}.${EXT[type]}`;
  const abs = path.join(/* turbopackIgnore: true */ uploadDir(), rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buf, { flag: 'wx' }); // never overwrite an existing file

  await connectDB();
  try {
    const media = await Media.create({ url: `/uploads/${rel}`, file: rel, name: String(file.name || '').slice(0, 200), type, size: buf.length, ...dimensions(buf, type), uploadedBy: userId });
    return toPlain(media);
  } catch (error) {
    await fs.unlink(abs).catch(() => {}); // keep disk and database in step
    throw error;
  }
}

// ?search=&page=&limit=
export async function listMedia({ search = '', page = 1, limit = 40, skip = 0 } = {}) {
  await connectDB();
  const filter = search ? { name: new RegExp(escapeRegex(search), 'i') } : {};
  const [rows, total] = await Promise.all([Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Media.countDocuments(filter)]);
  return { rows: toPlain(rows), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

// Where an image URL is used — shown before deleting it
export async function findUsage(url) {
  await connectDB();
  const [products, posts, team, clients, settings] = await Promise.all([
    Product.find({ image: url }).select('name').lean(),
    BlogPost.find({ coverImage: url }).select('title').lean(),
    TeamMember.find({ photo: url }).select('name').lean(),
    Client.find({ logo: url }).select('name').lean(),
    Setting.find({ 'value.ogImage': url }).select('key').lean(),
  ]);
  return [
    ...products.map((p) => `Product “${p.name}”`),
    ...posts.map((p) => `Blog post “${p.title}”`),
    ...team.map((m) => `Team member “${m.name}”`),
    ...clients.map((c) => `Client “${c.name || 'logo'}”`),
    ...settings.map(() => 'SEO share image'),
  ];
}

export async function deleteMedia(id, { force = false } = {}) {
  await connectDB();
  const media = await Media.findById(id).lean();
  if (!media) throw new HttpError(404, 'Image not found.');
  if (!force) {
    const usedIn = await findUsage(media.url);
    if (usedIn.length) throw new HttpError(409, `This image is still used by: ${usedIn.join(', ')}. Replace it there first, or delete anyway.`);
  }
  await Media.deleteOne({ _id: id });
  await fs.unlink(path.join(/* turbopackIgnore: true */ uploadDir(), media.file)).catch(() => {}); // already gone is fine
  return toPlain({ ...media, title: media.name });
}

// Absolute path of an uploaded file for serving, or null for anything outside UPLOAD_DIR
export function resolveUpload(segments) {
  const root = uploadDir();
  const abs = path.resolve(/* turbopackIgnore: true */ root, ...segments.map((s) => decodeURIComponent(s)));
  return abs.startsWith(root + path.sep) ? abs : null;
}
