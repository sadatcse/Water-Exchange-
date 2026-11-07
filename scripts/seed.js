// Loads the starter product categories, products, team, client logos and blog posts into the database.
//   npm run seed
// Safe to run again: categories, products and posts are added only when their slug is missing, and the team and
// clients only when their table is empty — nothing edited from the dashboard is overwritten.
import { closeDB } from '../src/lib/db.js';
import Product from '../src/models/Product.js';
import BlogPost from '../src/models/BlogPost.js';
import TeamMember from '../src/models/TeamMember.js';
import Client from '../src/models/Client.js';
import ProductCategory from '../src/models/ProductCategory.js';
import { seedProducts } from '../src/data/products.js';
import { seedBlogPosts } from '../src/data/seed/blog-posts.js';
import { seedTeam } from '../src/data/seed/team.js';
import { seedClients } from '../src/data/seed/clients.js';
import { seedCategories } from '../src/data/product-categories.js';
import { legacyCategoryMoves, LEGACY_CATEGORY_IDS } from '../src/data/seed/product-category-moves.js';

if (!process.env.DB_USER || !process.env.DB_NAME) {
  console.error('DB_USER / DB_NAME are missing in .env');
  process.exit(1);
}

// Inserts the rows whose slug is not in the table yet; returns how many were added
async function insertMissing(table, docs) {
  const existing = new Set((await table.find({ columns: ['slug'] })).map((d) => d.slug));
  const fresh = docs.filter((d) => !existing.has(d.slug));
  for (const doc of fresh) await table.insert(doc);
  return fresh.length;
}

const products = seedProducts.map((p, i) => ({
  ...p,
  specs: p.specs.map(([label, value]) => ({ label, value })),
  order: i,
}));
const posts = seedBlogPosts.map((p) => ({ ...p, publishedAt: new Date(p.publishedAt) }));

const addedCategories = await insertMissing(ProductCategory, seedCategories);
const addedProducts = await insertMissing(Product, products);
// Products still on one of the old four category ids move into the tree
let movedProducts = 0;
for (const p of await Product.find({ where: '`category` IN (?)', params: [LEGACY_CATEGORY_IDS], columns: ['slug'] })) {
  await Product.updateById(p._id, { category: legacyCategoryMoves[p.slug] || 'others' });
  movedProducts += 1;
}
const addedPosts = await insertMissing(BlogPost, posts);
// Inserts all rows only when the table is empty (no slug to match on)
const fillIfEmpty = async (table, docs) => {
  if ((await table.count()) > 0) return 0;
  for (const doc of docs) await table.insert(doc);
  return docs.length;
};
const addedTeam = await fillIfEmpty(TeamMember, seedTeam);
const addedClients = await fillIfEmpty(Client, seedClients);

console.log(`Product categories: +${addedCategories} (of ${seedCategories.length})`);
console.log(`Products: +${addedProducts} (of ${products.length})${movedProducts ? `, ${movedProducts} moved into the new categories` : ''}`);
console.log(`Blog posts: +${addedPosts} (of ${posts.length})`);
console.log(`Team members: +${addedTeam}${addedTeam ? '' : ' (team already set up)'}`);
console.log(`Clients: +${addedClients}${addedClients ? '' : ' (clients already set up)'}`);
await closeDB();
