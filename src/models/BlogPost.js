import { defineTable } from '../lib/table.js';
import { BLOG_CATEGORIES } from '../config/blog.js';

export { BLOG_CATEGORIES };

// Articles on /blog and /blog/[slug]. `content` is plain text: paragraphs separated by a blank line,
// lines starting with "## " become headings and lines starting with "- " become list items.
export default defineTable('blog_posts');
