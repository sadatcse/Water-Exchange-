// Contact form messages — Dashboard → Messages
import ContactMessage, { CONTACT_STATUSES } from '@/models/ContactMessage';
import { HttpError } from '@/server/http';
import { escapeRegex } from '@/lib/utils';
import { str, toPlain } from '@/server/validate';

// ?status=unread|read|replied&search=&page=&limit=
export async function listMessages({ status = '', search = '', page = 1, limit = 20, skip = 0 } = {}) {
  const filter = {};
  if (CONTACT_STATUSES.includes(status)) filter.status = status;
  if (search) {
    const re = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ fullName: re }, { email: re }, { phone: re }, { subject: re }, { message: re }];
  }
  const [rows, total, counts] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ContactMessage.countDocuments(filter),
    ContactMessage.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
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
  const message = await ContactMessage.findByIdAndUpdate(id, { status: value }, { new: true }).lean();
  if (!message) throw new HttpError(404, 'Message not found.');
  return toPlain(message);
}

export async function deleteMessage(id) {
  const message = await ContactMessage.findByIdAndDelete(id).select('fullName').lean();
  if (!message) throw new HttpError(404, 'Message not found.');
  return toPlain(message);
}
