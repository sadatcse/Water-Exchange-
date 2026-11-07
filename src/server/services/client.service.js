// Client logos — read by the home page and /clients, managed from Dashboard → Clients.
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
  return toPlain(await Client.find({ where: includeDrafts ? null : { published: true }, orderBy: { order: 1, createdAt: 1 } }));
}

export async function getClient(id) {
  const client = await Client.findById(id);
  if (!client) throw new HttpError(404, 'Client not found.');
  return toPlain(client);
}

export async function createClient(body) {
  return toPlain(await Client.insert(clean(body)));
}

export async function updateClient(id, body) {
  const client = await Client.updateById(id, clean(body));
  if (!client) throw new HttpError(404, 'Client not found.');
  return toPlain(client);
}

export async function deleteClient(id) {
  const client = await Client.deleteById(id);
  if (!client) throw new HttpError(404, 'Client not found.');
  return toPlain(client);
}
