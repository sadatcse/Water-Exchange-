// Product categories (Dashboard → Product Categories). The whole tree is small, so it is read in one
// query and cached briefly — public pages read it on every request.
import connectDB from '@/lib/db';
import ProductCategory from '@/models/ProductCategory';
import Product from '@/models/Product';
import { HttpError } from '@/server/http';
import { str, num, slugify, toPlain } from '@/server/validate';
import { CATEGORY_ICONS, descendantSlugs, pathTo } from '@/data/product-categories';

const MAX_DEPTH = 3; // group → category → sub-category
const CACHE_MS = 60 * 1000;
let cache = null;

export async function listCategories({ fresh = false } = {}) {
  if (!fresh && cache && cache.expires > Date.now()) return cache.list;
  await connectDB();
  const list = toPlain(await ProductCategory.find().sort({ order: 1, name: 1 }).lean());
  cache = { list, expires: Date.now() + CACHE_MS };
  return list;
}

const invalidate = () => {
  cache = null;
};

// Product counts per category, including everything below it (admin list)
export async function listCategoriesWithCounts() {
  const [list, counts] = await Promise.all([
    listCategories({ fresh: true }),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const direct = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  return list.map((c) => ({
    ...c,
    products: direct[c.slug] || 0,
    totalProducts: descendantSlugs(list, c.slug).reduce((sum, s) => sum + (direct[s] || 0), 0),
  }));
}

export async function categoryExists(slug) {
  return (await listCategories()).some((c) => c.slug === slug);
}

async function clean(body, current) {
  const list = await listCategories({ fresh: true });
  const name = str(body.name, 100);
  const data = {
    name,
    slug: slugify(body.slug || name),
    parent: slugify(body.parent || ''),
    icon: str(body.icon, 30),
    description: str(body.description, 300),
    order: num(body.order),
  };
  if (!data.name) throw new HttpError(400, 'Name is required.');
  if (!data.slug) throw new HttpError(400, 'Slug is required.');
  if (data.parent) {
    const parent = list.find((c) => c.slug === data.parent);
    if (!parent) throw new HttpError(400, 'The parent category does not exist.');
    // A category can't move under itself or one of its own sub-categories
    if (current && descendantSlugs(list, current.slug).includes(data.parent)) throw new HttpError(400, 'A category cannot be placed inside itself.');
    const depth = pathTo(list, data.parent).length + 1;
    const below = current ? Math.max(...descendantSlugs(list, current.slug).map((s) => pathTo(list, s).length - pathTo(list, current.slug).length)) : 0;
    if (depth + below > MAX_DEPTH) throw new HttpError(400, `Categories go at most ${MAX_DEPTH} levels deep.`);
    data.icon = ''; // only top-level groups show an icon
  } else if (data.icon && !CATEGORY_ICONS[data.icon]) {
    throw new HttpError(400, 'Choose an icon from the list.');
  }
  return data;
}

export async function createCategory(body) {
  const data = await clean(body);
  await connectDB();
  const category = await ProductCategory.create(data);
  invalidate();
  return toPlain(category);
}

export async function updateCategory(id, body) {
  await connectDB();
  const current = await ProductCategory.findById(id).lean();
  if (!current) throw new HttpError(404, 'Category not found.');
  const data = await clean(body, current);
  const category = await ProductCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  // A new slug is carried over to its sub-categories and products
  if (data.slug !== current.slug) {
    await Promise.all([
      ProductCategory.updateMany({ parent: current.slug }, { parent: data.slug }),
      Product.updateMany({ category: current.slug }, { category: data.slug }),
    ]);
  }
  invalidate();
  return toPlain(category);
}

export async function deleteCategory(id) {
  await connectDB();
  const category = await ProductCategory.findById(id).lean();
  if (!category) throw new HttpError(404, 'Category not found.');
  const [children, products] = await Promise.all([ProductCategory.countDocuments({ parent: category.slug }), Product.countDocuments({ category: category.slug })]);
  if (children) throw new HttpError(409, `Move or delete its ${children} sub-categor${children === 1 ? 'y' : 'ies'} first.`);
  if (products) throw new HttpError(409, `${products} product${products === 1 ? ' uses' : 's use'} this category — move ${products === 1 ? 'it' : 'them'} to another category first.`);
  await ProductCategory.deleteOne({ _id: id });
  invalidate();
  return toPlain(category);
}
