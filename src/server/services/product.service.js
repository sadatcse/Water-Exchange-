// Products — read by the public pages (server components) and managed from Dashboard → Products.
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { listCategories } from '@/server/services/category.service';
import { categoryInfo } from '@/data/product-categories';
import { HttpError } from '@/server/http';
import { str, bool, num, strList, pairList, slugify, imageUrl, toPlain } from '@/server/validate';

const CARD_FIELDS = 'slug name category image brand origin summary highlights order';

// Request body → validated product fields (create and update both send the whole product)
async function clean(body) {
  const name = str(body.name, 160);
  const data = {
    name,
    slug: slugify(body.slug || name),
    category: slugify(body.category),
    image: imageUrl(body.image),
    brand: str(body.brand, 160),
    origin: str(body.origin, 120),
    summary: str(body.summary, 400),
    question: str(body.question, 200),
    overview: strList(body.overview, { maxItems: 10, max: 2000 }),
    distinction: { text: str(body.distinction?.text, 1000), see: strList(body.distinction?.see, { maxItems: 6, max: 120 }).map(slugify) },
    highlights: pairList(body.highlights, 3),
    features: strList(body.features, { maxItems: 20, max: 300 }),
    specs: pairList(body.specs),
    applications: strList(body.applications, { maxItems: 20, max: 200 }),
    order: num(body.order),
    published: bool(body.published, true),
  };
  if (!data.name) throw new HttpError(400, 'Name is required.');
  if (!data.slug) throw new HttpError(400, 'Slug is required.');
  if (!(await listCategories()).some((c) => c.slug === data.category)) throw new HttpError(400, 'Choose a category.');
  if (!data.image) throw new HttpError(400, 'Image must be a /images/… path or an http(s) URL.');
  if (!data.summary) throw new HttpError(400, 'Summary is required.');
  return data;
}

// ---------- public ----------

// Adds categoryInfo { name, slug, groupName, groupSlug, icon, path } for display
const withCategory = (list) => (product) => ({ ...product, categoryInfo: categoryInfo(list, product.category) });

export async function listProducts({ includeDrafts = false, full = false } = {}) {
  await connectDB();
  const filter = includeDrafts ? {} : { published: true };
  const query = Product.find(filter).sort({ order: 1, createdAt: 1 });
  if (!full) query.select(includeDrafts ? `${CARD_FIELDS} published updatedAt` : CARD_FIELDS);
  const [products, categories] = await Promise.all([query.lean(), listCategories()]);
  return toPlain(products).map(withCategory(categories));
}

export async function getProductBySlug(slug, { includeDrafts = false } = {}) {
  if (!slug || typeof slug !== 'string') return null;
  await connectDB();
  const [product, categories] = await Promise.all([
    Product.findOne({ slug: slug.toLowerCase(), ...(!includeDrafts && { published: true }) }).lean(),
    listCategories(),
  ]);
  return product ? withCategory(categories)(toPlain(product)) : null;
}

// Linked products first, then the same category, then the same group, then the rest
export async function relatedProducts(product, limit = 3) {
  const all = await listProducts();
  const others = all.filter((p) => p.slug !== product.slug);
  const linked = product.distinction.see.map((s) => others.find((p) => p.slug === s)).filter(Boolean);
  const group = product.categoryInfo?.groupSlug;
  const same = others.filter((p) => p.category === product.category && !linked.includes(p));
  const sameGroup = others.filter((p) => group && p.categoryInfo?.groupSlug === group && !linked.includes(p) && !same.includes(p));
  const rest = others.filter((p) => !linked.includes(p) && !same.includes(p) && !sameGroup.includes(p));
  return { linked, related: [...linked, ...same, ...sameGroup, ...rest].slice(0, limit) };
}

// ---------- admin ----------

export async function getProduct(id) {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) throw new HttpError(404, 'Product not found.');
  return toPlain(product);
}

export async function createProduct(body) {
  await connectDB();
  return toPlain(await Product.create(await clean(body)));
}

export async function updateProduct(id, body) {
  await connectDB();
  const product = await Product.findByIdAndUpdate(id, await clean(body), { new: true, runValidators: true }).lean();
  if (!product) throw new HttpError(404, 'Product not found.');
  return toPlain(product);
}

export async function deleteProduct(id) {
  await connectDB();
  const product = await Product.findByIdAndDelete(id).select('name').lean();
  if (!product) throw new HttpError(404, 'Product not found.');
  return toPlain(product);
}
