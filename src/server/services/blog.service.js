// Blog posts — read by /blog, /blog/[slug] and the home page, managed from Dashboard → Blog.
import BlogPost, { BLOG_CATEGORIES } from '@/models/BlogPost';
import { contains } from '@/lib/table';
import { HttpError } from '@/server/http';
import { str, bool, strList, slugify, imageUrl, toPlain } from '@/server/validate';

const CARD_FIELDS = ['slug', 'title', 'excerpt', 'category', 'coverImage', 'author', 'publishedAt', 'content'];
const NEWEST = { publishedAt: -1 };
// Published and not scheduled for later (one parameter: now)
const LIVE = '`published` = 1 AND `publishedAt` <= ?';

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
  const now = new Date();
  const byCategory = BLOG_CATEGORIES.includes(category);
  const where = byCategory ? `${LIVE} AND \`category\` = ?` : LIVE;
  const params = byCategory ? [now, category] : [now];
  const [posts, total, counts] = await Promise.all([
    BlogPost.find({ where, params, columns: CARD_FIELDS, orderBy: NEWEST, offset: (page - 1) * limit, limit }),
    BlogPost.count(where, params),
    BlogPost.countBy('category', LIVE, [now]),
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
  const post = await BlogPost.findOne(`${LIVE} AND \`slug\` = ?`, [new Date(), slug.toLowerCase()]);
  if (!post) return null;
  const { readMinutes } = withReadTime(post);
  return { ...toPlain(post), readMinutes };
}

// Same category first, then the newest others
export async function relatedPosts(post, limit = 3) {
  const base = `${LIVE} AND \`slug\` <> ?`;
  const params = [new Date(), post.slug, post.category];
  const same = await BlogPost.find({ where: `${base} AND \`category\` = ?`, params, columns: CARD_FIELDS, orderBy: NEWEST, limit });
  const more =
    same.length < limit
      ? await BlogPost.find({ where: `${base} AND \`category\` <> ?`, params, columns: CARD_FIELDS, orderBy: NEWEST, limit: limit - same.length })
      : [];
  return toPlain([...same, ...more]).map(withReadTime);
}

export async function allPublishedSlugs() {
  return toPlain(await BlogPost.find({ where: LIVE, params: [new Date()], columns: ['slug', 'updatedAt'] }));
}

// ---------- admin ----------

// ?search=&category=&status=published|draft&page=&limit=
export async function listPostsAdmin({ search = '', category = '', status = '', page = 1, limit = 20, skip = 0 } = {}) {
  const conds = [];
  const params = [];
  if (BLOG_CATEGORIES.includes(category)) {
    conds.push('`category` = ?');
    params.push(category);
  }
  if (status === 'published') conds.push('`published` = 1');
  if (status === 'draft') conds.push('`published` = 0');
  if (search) {
    conds.push('(`title` LIKE ? OR `excerpt` LIKE ? OR `author` LIKE ?)');
    params.push(...Array(3).fill(contains(search)));
  }
  const where = conds.join(' AND ');
  const columns = ['slug', 'title', 'category', 'coverImage', 'author', 'published', 'publishedAt', 'updatedAt'];
  const [rows, total] = await Promise.all([BlogPost.find({ where, params, columns, orderBy: NEWEST, offset: skip, limit }), BlogPost.count(where, params)]);
  return { rows: toPlain(rows), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function getPost(id) {
  const post = await BlogPost.findById(id);
  if (!post) throw new HttpError(404, 'Post not found.');
  return toPlain(post);
}

export async function createPost(body) {
  return toPlain(await BlogPost.insert(clean(body)));
}

export async function updatePost(id, body) {
  const post = await BlogPost.updateById(id, clean(body));
  if (!post) throw new HttpError(404, 'Post not found.');
  return toPlain(post);
}

export async function deletePost(id) {
  const post = await BlogPost.deleteById(id);
  if (!post) throw new HttpError(404, 'Post not found.');
  return toPlain(post);
}
