// Admin: products, blog posts, team members, client logos and contact messages (Dashboard → Content / Messages).
// Public pages read the same services directly from server components.
import { ok, created, readJson } from '@/server/http';
import { pageParams, str } from '@/server/validate';
import * as productService from '@/server/services/product.service';
import * as blogService from '@/server/services/blog.service';
import * as teamService from '@/server/services/team.service';
import * as contactService from '@/server/services/contact.service';
import * as clientService from '@/server/services/client.service';
import * as categoryService from '@/server/services/category.service';

// ---------- products ----------
export const listProducts = async () => ok(await productService.listProducts({ includeDrafts: true }));
export const showProduct = async ({ params }) => ok(await productService.getProduct(params.id));
export const createProduct = async ({ req }) => created(await productService.createProduct(await readJson(req)), 'Product created.');
export const updateProduct = async ({ req, params }) => ok(await productService.updateProduct(params.id, await readJson(req)), 'Product saved.');
export const deleteProduct = async ({ params }) => ok(await productService.deleteProduct(params.id), 'Product deleted.');

// ---------- product categories ----------
export const listCategories = async () => ok(await categoryService.listCategoriesWithCounts());
export const createCategory = async ({ req }) => created(await categoryService.createCategory(await readJson(req)), 'Category added.');
export const updateCategory = async ({ req, params }) => ok(await categoryService.updateCategory(params.id, await readJson(req)), 'Category saved.');
export const deleteCategory = async ({ params }) => ok(await categoryService.deleteCategory(params.id), 'Category deleted.');

// ---------- blog ----------
// ?search=&category=&status=&page=&limit=
export async function listPosts({ query }) {
  const { page, limit, skip } = pageParams(query);
  return ok(
    await blogService.listPostsAdmin({ search: str(query.get('search'), 100), category: str(query.get('category'), 40), status: str(query.get('status'), 20), page, limit, skip })
  );
}
export const showPost = async ({ params }) => ok(await blogService.getPost(params.id));
export const createPost = async ({ req }) => created(await blogService.createPost(await readJson(req)), 'Post created.');
export const updatePost = async ({ req, params }) => ok(await blogService.updatePost(params.id, await readJson(req)), 'Post saved.');
export const deletePost = async ({ params }) => ok(await blogService.deletePost(params.id), 'Post deleted.');

// ---------- team ----------
export const listTeam = async () => ok(await teamService.listTeam({ includeDrafts: true }));
export const showMember = async ({ params }) => ok(await teamService.getMember(params.id));
export const createMember = async ({ req }) => created(await teamService.createMember(await readJson(req)), 'Team member added.');
export const updateMember = async ({ req, params }) => ok(await teamService.updateMember(params.id, await readJson(req)), 'Team member saved.');
export const deleteMember = async ({ params }) => ok(await teamService.deleteMember(params.id), 'Team member removed.');

// ---------- clients ----------
export const listClients = async () => ok(await clientService.listClients({ includeDrafts: true }));
export const showClient = async ({ params }) => ok(await clientService.getClient(params.id));
export const createClient = async ({ req }) => created(await clientService.createClient(await readJson(req)), 'Client added.');
export const updateClient = async ({ req, params }) => ok(await clientService.updateClient(params.id, await readJson(req)), 'Client saved.');
export const deleteClient = async ({ params }) => ok(await clientService.deleteClient(params.id), 'Client removed.');

// ---------- contact messages ----------
// ?status=&search=&page=&limit=
export async function listMessages({ query }) {
  const { page, limit, skip } = pageParams(query);
  return ok(await contactService.listMessages({ status: str(query.get('status'), 20), search: str(query.get('search'), 100), page, limit, skip }));
}
export const updateMessage = async ({ req, params }) => ok(await contactService.setMessageStatus(params.id, (await readJson(req)).status), 'Message updated.');
export const deleteMessage = async ({ params }) => ok(await contactService.deleteMessage(params.id), 'Message deleted.');
