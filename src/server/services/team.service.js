// Team members — read by "Meet the team" (home, /about), managed from Dashboard → Team.
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
  const members = await TeamMember.find({ where: includeDrafts ? null : { published: true }, orderBy: { featured: -1, order: 1, createdAt: 1 } });
  return toPlain(members);
}

export async function getMember(id) {
  const member = await TeamMember.findById(id);
  if (!member) throw new HttpError(404, 'Team member not found.');
  return toPlain(member);
}

// Only one featured member (the large card): featuring someone un-features the rest
async function keepOneFeatured(data, id) {
  if (data.featured) await TeamMember.updateWhere('`featured` = 1 AND `id` <> ?', [id || ''], { featured: false });
}

export async function createMember(body) {
  const data = clean(body);
  await keepOneFeatured(data);
  return toPlain(await TeamMember.insert(data));
}

export async function updateMember(id, body) {
  const data = clean(body);
  await keepOneFeatured(data, id);
  const member = await TeamMember.updateById(id, data);
  if (!member) throw new HttpError(404, 'Team member not found.');
  return toPlain(member);
}

export async function deleteMember(id) {
  const member = await TeamMember.deleteById(id);
  if (!member) throw new HttpError(404, 'Team member not found.');
  return toPlain(member);
}
