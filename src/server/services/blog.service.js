// Blog posts — read by /blog, /blog/[slug] and the home page, managed from Dashboard → Blog.
import connectDB from '@/lib/db';
import BlogPost, { BLOG_CATEGORIES } from '@/models/BlogPost';
import { HttpError } from '@/server/http';
import { escapeRegex } from '@/lib/utils';
import { str, bool, strList, slugify, imageUrl, toPlain } from '@/server/validate';

const CARD_FIELDS = 'slug title excerpt category coverImage author publishedAt content';

// ~200 words a minute; `content` is dropped from list results after this is worked out
const withReadTime = ({ content = '', ...post }) => ({
  ...post,
  readMinutes: Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200)),
});

function clean(body) {
  const title = str(body.title, 200);
  const publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
  const data = {
    title,
    slug: slugify(body.slug || title),
    excerpt: str(body.excerpt, 400),
    content: str(body.content, 50000),
    category: str(body.category, 40),
    coverImage: imageUrl(body.coverImage),
    author: str(body.author, 120) || 'Water Exchange',
    tags: strList(body.tags, { maxItems: 10, max: 40 }),
    published: bool(body.published, true),
    publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
  };
  if (!data.title) throw new HttpError(400, 'Title is required.');
  if (!data.slug) throw new HttpError(400, 'Slug is required.');
  if (!BLOG_CATEGORIES.includes(data.category)) throw new HttpError(400, 'Choose a category.');
  if (!data.coverImage) throw new HttpError(400, 'Cover image must be a /images/… path or an http(s) URL.');
  if (!data.excerpt) throw new HttpError(400, 'Excerpt is required.');
  if (!data.content) throw new HttpError(400, 'Content is required.');
  return data;
}

// ---------- public ----------

// Published posts, newest first. Returns { posts, total, page, pageCount, categories: [{ name, count }] }
export async function listPublishedPosts({ category = '', page = 1, limit = 9 } = {}) {
  await connectDB();
  const filter = { published: true, publishedAt: { $lte: new Date() }, ...(BLOG_CATEGORIES.includes(category) && { category }) };
  const [posts, total, counts] = await Promise.all([
    BlogPost.find(filter).select(CARD_FIELDS).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    BlogPost.countDocuments(filter),
    BlogPost.aggregate([{ $match: { published: true, publishedAt: { $lte: new Date() } } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  return {
    posts: toPlain(posts).map(withReadTime),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
    categories: BLOG_CATEGORIES.map((name) => ({ name, count: counts.find((c) => c._id === name)?.count || 0 })).filter((c) => c.count),
  };
}

export async function latestPosts(limit = 3) {
  return (await listPublishedPosts({ limit })).posts;
}

export async function getPostBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  await connectDB();
  const post = await BlogPost.findOne({ slug: slug.toLowerCase(), published: true, publishedAt: { $lte: new Date() } }).lean();
  if (!post) return null;
  const { readMinutes } = withReadTime(post);
  return { ...toPlain(post), readMinutes };
}

// Same category first, then the newest others
export async function relatedPosts(post, limit = 3) {
  await connectDB();
  const base = { published: true, publishedAt: { $lte: new Date() }, slug: { $ne: post.slug } };
  const same = await BlogPost.find({ ...base, category: post.category }).select(CARD_FIELDS).sort({ publishedAt: -1 }).limit(limit).lean();
  const more =
    same.length < limit
      ? await BlogPost.find({ ...base, category: { $ne: post.category } }).select(CARD_FIELDS).sort({ publishedAt: -1 }).limit(limit - same.length).lean()
      : [];
  return toPlain([...same, ...more]).map(withReadTime);
}

export async function allPublishedSlugs() {
  await connectDB();
  return toPlain(await BlogPost.find({ published: true, publishedAt: { $lte: new Date() } }).select('slug updatedAt').lean());
}

// ---------- admin ----------

// ?search=&category=&status=published|draft&page=&limit=
export async function listPostsAdmin({ search = '', category = '', status = '', page = 1, limit = 20, skip = 0 } = {}) {
  await connectDB();
  const filter = {};
  if (BLOG_CATEGORIES.includes(category)) filter.category = category;
  if (status === 'published') filter.published = true;
  if (status === 'draft') filter.published = false;
  if (search) {
    const re = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: re }, { excerpt: re }, { author: re }];
  }
  const [rows, total] = await Promise.all([
    BlogPost.find(filter).select('slug title category coverImage author published publishedAt updatedAt').sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(filter),
  ]);
  return { rows: toPlain(rows), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function getPost(id) {
  await connectDB();
  const post = await BlogPost.findById(id).lean();
  if (!post) throw new HttpError(404, 'Post not found.');
  return toPlain(post);
}

export async function createPost(body) {
  await connectDB();
  return toPlain(await BlogPost.create(clean(body)));
}

export async function updatePost(id, body) {
  await connectDB();
  const post = await BlogPost.findByIdAndUpdate(id, clean(body), { new: true, runValidators: true }).lean();
  if (!post) throw new HttpError(404, 'Post not found.');
  return toPlain(post);
}

export async function deletePost(id) {
  await connectDB();
  const post = await BlogPost.findByIdAndDelete(id).select('title').lean();
  if (!post) throw new HttpError(404, 'Post not found.');
  return toPlain(post);
}
