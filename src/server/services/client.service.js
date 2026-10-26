// Client logos — read by the home page and /clients, managed from Dashboard → Clients.
import connectDB from '@/lib/db';
import Client from '@/models/Client';
import { HttpError } from '@/server/http';
import { str, bool, num, imageUrl, toPlain } from '@/server/validate';

function clean(body) {
  const data = {
    name: str(body.name, 160),
    logo: imageUrl(body.logo),
    sector: str(body.sector, 80),
    order: num(body.order),
    published: bool(body.published, true),
  };
  if (!data.logo) throw new HttpError(400, 'Logo must be a /images/… path or an http(s) URL.');
  return data;
}

export async function listClients({ includeDrafts = false } = {}) {
  await connectDB();
  return toPlain(await Client.find(includeDrafts ? {} : { published: true }).sort({ order: 1, createdAt: 1 }).lean());
}

export async function getClient(id) {
  await connectDB();
  const client = await Client.findById(id).lean();
  if (!client) throw new HttpError(404, 'Client not found.');
  return toPlain(client);
}

export async function createClient(body) {
  await connectDB();
  return toPlain(await Client.create(clean(body)));
}

export async function updateClient(id, body) {
  await connectDB();
  const client = await Client.findByIdAndUpdate(id, clean(body), { new: true, runValidators: true }).lean();
  if (!client) throw new HttpError(404, 'Client not found.');
  return toPlain(client);
}

export async function deleteClient(id) {
  await connectDB();
  const client = await Client.findByIdAndDelete(id).select('name').lean();
  if (!client) throw new HttpError(404, 'Client not found.');
  return toPlain(client);
}
