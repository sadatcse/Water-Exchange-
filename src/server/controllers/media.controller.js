// Admin: image uploads (Dashboard → Media and the Upload buttons on every image field)
import { ok, created, HttpError } from '@/server/http';
import { pageParams, str } from '@/server/validate';
import * as media from '@/server/services/media.service';

// ?search=&page=&limit=
export async function list({ query }) {
  const { page, limit, skip } = pageParams(query, { defaultLimit: 40, maxLimit: 100 });
  return ok(await media.listMedia({ search: str(query.get('search'), 100), page, limit, skip }));
}

// multipart/form-data with one "file" field
export async function upload({ req, session }) {
  let form;
  try {
    form = await req.formData();
  } catch {
    throw new HttpError(400, 'Send the image as form data.');
  }
  return created(await media.saveUpload(form.get('file'), { userId: session._id }), 'Image uploaded.');
}

// ?force=1 deletes even when the image is still used somewhere
export const remove = async ({ params, query }) => ok(await media.deleteMedia(params.id, { force: query.get('force') === '1' }), 'Image deleted.');
