// Loads the starter product categories, products, team, client logos and blog posts into MongoDB.
//   npm run seed
// Safe to run again: categories, products and posts are added only when their slug is missing, and the team and
// clients only when their collection is empty — nothing edited from the dashboard is overwritten.
import mongoose from 'mongoose';
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

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

// Inserts the docs whose slug is not in the collection yet; returns how many were added
async function insertMissing(Model, docs) {
  const existing = new Set((await Model.find({ slug: { $in: docs.map((d) => d.slug) } }).select('slug').lean()).map((d) => d.slug));
  const fresh = docs.filter((d) => !existing.has(d.slug));
  if (fresh.length) await Model.insertMany(fresh);
  return fresh.length;
}

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([Product.syncIndexes(), BlogPost.syncIndexes(), TeamMember.syncIndexes(), Client.syncIndexes(), ProductCategory.syncIndexes()]);

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
for (const p of await Product.find({ category: { $in: LEGACY_CATEGORY_IDS } }).select('slug').lean()) {
  await Product.updateOne({ _id: p._id }, { category: legacyCategoryMoves[p.slug] || 'others' });
  movedProducts += 1;
}
const addedPosts = await insertMissing(BlogPost, posts);
// Inserts all docs only when the collection is empty (no slug to match on)
const fillIfEmpty = async (Model, docs) => ((await Model.estimatedDocumentCount()) === 0 ? (await Model.insertMany(docs)).length : 0);
const addedTeam = await fillIfEmpty(TeamMember, seedTeam);
const addedClients = await fillIfEmpty(Client, seedClients);

console.log(`Product categories: +${addedCategories} (of ${seedCategories.length})`);
console.log(`Products: +${addedProducts} (of ${products.length})${movedProducts ? `, ${movedProducts} moved into the new categories` : ''}`);
console.log(`Blog posts: +${addedPosts} (of ${posts.length})`);
console.log(`Team members: +${addedTeam}${addedTeam ? '' : ' (team already set up)'}`);
console.log(`Clients: +${addedClients}${addedClients ? '' : ' (clients already set up)'}`);
await mongoose.disconnect();
