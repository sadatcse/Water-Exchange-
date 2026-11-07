import { defineTable } from '../lib/table.js';

// Product category tree (Dashboard → Product Categories). Children point to their parent by slug ('' = top level).
export default defineTable('product_categories');
