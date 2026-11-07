import { defineTable } from '../lib/table.js';

// Equipment shown on /products, /products/[slug] and the home page.
// `category` is the slug of a ProductCategory (any level of the tree) — checked by product.service.js.
export default defineTable('products');
