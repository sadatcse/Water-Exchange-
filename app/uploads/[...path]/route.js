import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveUpload } from '@/server/services/media.service';

export const dynamic = 'force-dynamic';

const TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif' };

// Public: serves uploaded images from UPLOAD_DIR. File names are unique, so they can be cached for a year.
export async function GET(_req, { params }) {
  const file = resolveUpload((await params).path || []);
  const type = file && TYPES[path.extname(file).toLowerCase()];
  if (!type) return new Response('Not found', { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(data, {
      headers: {
        'Content-Type': type,
        'Content-Length': String(data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
