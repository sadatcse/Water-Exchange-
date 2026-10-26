import mongoose from 'mongoose';
import { BLOG_CATEGORIES } from '../config/blog.js';

export { BLOG_CATEGORIES };

// Articles on /blog and /blog/[slug]. `content` is plain text: paragraphs separated by a blank line,
// lines starting with "## " become headings and lines starting with "- " become list items.
const BlogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: [true, 'Slug is required'], unique: true, lowercase: true, trim: true, maxlength: 160 },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    excerpt: { type: String, required: [true, 'Excerpt is required'], trim: true, maxlength: 400 },
    content: { type: String, required: [true, 'Content is required'], maxlength: 50000 },
    category: { type: String, enum: BLOG_CATEGORIES, required: [true, 'Category is required'], index: true },
    coverImage: { type: String, required: [true, 'Cover image is required'], trim: true, maxlength: 600 },
    author: { type: String, trim: true, default: 'Water Exchange', maxlength: 120 },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BlogPostSchema.index({ published: 1, publishedAt: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
