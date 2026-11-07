// Contact form messages — Dashboard → Messages
import ContactMessage, { CONTACT_STATUSES } from '@/models/ContactMessage';
import { contains } from '@/lib/table';
import { HttpError } from '@/server/http';
import { str, toPlain } from '@/server/validate';

// ?status=unread|read|replied&search=&page=&limit=
export async function listMessages({ status = '', search = '', page = 1, limit = 20, skip = 0 } = {}) {
  const conds = [];
  const params = [];
  if (CONTACT_STATUSES.includes(status)) {
    conds.push('`status` = ?');
    params.push(status);
  }
  if (search) {
    conds.push('(`fullName` LIKE ? OR `email` LIKE ? OR `phone` LIKE ? OR `subject` LIKE ? OR `message` LIKE ?)');
    params.push(...Array(5).fill(contains(search)));
  }
  const where = conds.join(' AND ');
  const [rows, total, counts] = await Promise.all([
    ContactMessage.find({ where, params, orderBy: { createdAt: -1 }, offset: skip, limit }),
    ContactMessage.count(where, params),
    ContactMessage.countBy('status'),
  ]);
  return {
    rows: toPlain(rows),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
    counts: Object.fromEntries(CONTACT_STATUSES.map((s) => [s, counts.find((c) => c._id === s)?.count || 0])),
  };
}

export async function setMessageStatus(id, status) {
  const value = str(status, 20);
  if (!CONTACT_STATUSES.includes(value)) throw new HttpError(400, 'Unknown status.');
  const message = await ContactMessage.updateById(id, { status: value });
  if (!message) throw new HttpError(404, 'Message not found.');
  return toPlain(message);
}

export async function deleteMessage(id) {
  const message = await ContactMessage.deleteById(id);
  if (!message) throw new HttpError(404, 'Message not found.');
  return toPlain(message);
}
