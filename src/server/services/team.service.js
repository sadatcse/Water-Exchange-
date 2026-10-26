// Team members — read by "Meet the team" (home, /about), managed from Dashboard → Team.
import connectDB from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import { HttpError } from '@/server/http';
import { str, bool, num, imageUrl, toPlain } from '@/server/validate';

function clean(body) {
  const data = {
    name: str(body.name, 120),
    role: str(body.role, 120),
    credentials: str(body.credentials, 200),
    photo: body.photo ? imageUrl(body.photo) : '',
    featured: bool(body.featured),
    order: num(body.order),
    published: bool(body.published, true),
  };
  if (!data.name) throw new HttpError(400, 'Name is required.');
  if (!data.role) throw new HttpError(400, 'Role is required.');
  if (body.photo && !data.photo) throw new HttpError(400, 'Photo must be a /images/… path or an http(s) URL.');
  return data;
}

export async function listTeam({ includeDrafts = false } = {}) {
  await connectDB();
  const members = await TeamMember.find(includeDrafts ? {} : { published: true }).sort({ featured: -1, order: 1, createdAt: 1 }).lean();
  return toPlain(members);
}

export async function getMember(id) {
  await connectDB();
  const member = await TeamMember.findById(id).lean();
  if (!member) throw new HttpError(404, 'Team member not found.');
  return toPlain(member);
}

// Only one featured member (the large card): featuring someone un-features the rest
async function keepOneFeatured(data, id) {
  if (data.featured) await TeamMember.updateMany({ featured: true, ...(id && { _id: { $ne: id } }) }, { featured: false });
}

export async function createMember(body) {
  await connectDB();
  const data = clean(body);
  await keepOneFeatured(data);
  return toPlain(await TeamMember.create(data));
}

export async function updateMember(id, body) {
  await connectDB();
  const data = clean(body);
  await keepOneFeatured(data, id);
  const member = await TeamMember.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!member) throw new HttpError(404, 'Team member not found.');
  return toPlain(member);
}

export async function deleteMember(id) {
  await connectDB();
  const member = await TeamMember.findByIdAndDelete(id).select('name').lean();
  if (!member) throw new HttpError(404, 'Team member not found.');
  return toPlain(member);
}
