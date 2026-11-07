// MariaDB / MySQL tables. Created on first connect (src/lib/db.js); a column added here is added to an existing
// table the same way (new indexes are not — add those by hand). Every table has `id` CHAR(24): the same 24-hex
// ids MongoDB used, so ids from the old database, existing sessions and dashboard links keep working. Rows come
// back with the id as `_id`.

const str = (n) => ({ sql: `VARCHAR(${n}) NOT NULL DEFAULT ''`, kind: 'str' });
const text = (type = 'TEXT') => ({ sql: `${type} NULL`, kind: 'text' });
const num = () => ({ sql: 'DOUBLE NOT NULL DEFAULT 0', kind: 'num' });
const bool = (fallback = false) => ({ sql: `TINYINT(1) NOT NULL DEFAULT ${fallback ? 1 : 0}`, kind: 'bool', fallback });
const date = () => ({ sql: 'DATETIME(3) NULL', kind: 'date' });
const ref = () => ({ sql: 'CHAR(24) NULL', kind: 'ref' });
// Arrays and nested objects; `fallback` is returned for an empty column
const json = (fallback) => ({ sql: 'LONGTEXT NULL', kind: 'json', fallback });

const pairs = () => json([]);

export const TABLES = {
  users: {
    columns: {
      name: str(120),
      email: str(160),
      password: str(100), // bcrypt hash
      role: str(20),
      status: str(20),
      lastLoginAt: date(),
    },
    indexes: ['UNIQUE KEY `email` (`email`)', 'KEY `role` (`role`)'],
    timestamps: true,
  },
  product_categories: {
    columns: { name: str(100), slug: str(120), parent: str(120), icon: str(30), description: str(300), order: num() },
    indexes: ['UNIQUE KEY `slug` (`slug`)', 'KEY `parent` (`parent`)'],
    timestamps: true,
  },
  products: {
    columns: {
      slug: str(120),
      name: str(160),
      category: str(120),
      image: str(600),
      brand: str(160),
      origin: str(120),
      summary: str(400),
      question: str(200),
      overview: json([]),
      distinction: json({ text: '', see: [] }),
      highlights: pairs(),
      features: json([]),
      specs: pairs(),
      applications: json([]),
      order: num(),
      published: bool(true),
    },
    indexes: ['UNIQUE KEY `slug` (`slug`)', 'KEY `category` (`category`)', 'KEY `published_order` (`published`, `order`)'],
    timestamps: true,
  },
  blog_posts: {
    columns: {
      slug: str(160),
      title: str(200),
      excerpt: str(400),
      content: text('MEDIUMTEXT'),
      category: str(40),
      coverImage: str(600),
      author: str(120),
      tags: json([]),
      published: bool(true),
      publishedAt: date(),
    },
    indexes: ['UNIQUE KEY `slug` (`slug`)', 'KEY `category` (`category`)', 'KEY `published_date` (`published`, `publishedAt`)'],
    timestamps: true,
  },
  team_members: {
    columns: { name: str(120), role: str(120), credentials: str(200), photo: str(600), featured: bool(), order: num(), published: bool(true) },
    indexes: ['KEY `published_order` (`published`, `order`)'],
    timestamps: true,
  },
  clients: {
    columns: { name: str(160), logo: str(600), sector: str(80), order: num(), published: bool(true) },
    indexes: ['KEY `published_order` (`published`, `order`)'],
    timestamps: true,
  },
  contact_messages: {
    columns: { fullName: str(120), email: str(160), phone: str(30), subject: str(200), message: text(), status: str(20) },
    indexes: ['KEY `status` (`status`)', 'KEY `createdAt` (`createdAt`)'],
    timestamps: true,
  },
  media: {
    columns: { url: str(600), file: str(600), name: str(200), type: str(40), size: num(), width: num(), height: num(), uploadedBy: ref() },
    indexes: ['UNIQUE KEY `url` (`url`)', 'KEY `createdAt` (`createdAt`)'],
    timestamps: true,
  },
  settings: {
    columns: { key: str(60), value: json({}), updatedBy: ref() },
    indexes: ['UNIQUE KEY `key` (`key`)'],
    timestamps: true,
  },
  visitor_logs: {
    columns: {
      ip: str(64),
      country: str(80),
      referrer: str(500),
      source: str(20),
      sourceName: str(120),
      path: str(300),
      userAgent: str(500),
      device: str(40),
      browser: str(60),
      os: str(60),
    },
    indexes: ['KEY `createdAt` (`createdAt`)'],
  },
  login_logs: {
    columns: {
      user: ref(),
      email: str(160),
      name: str(120),
      role: str(20),
      success: bool(),
      reason: str(200),
      ip: str(64),
      country: str(80),
      city: str(120),
      browser: str(60),
      os: str(60),
      device: str(40),
      userAgent: str(400),
    },
    indexes: ['KEY `user` (`user`)', 'KEY `success` (`success`)', 'KEY `createdAt` (`createdAt`)'],
  },
  activity_logs: {
    columns: {
      user: ref(),
      name: str(120),
      email: str(160),
      role: str(20),
      action: str(40),
      entity: str(60),
      entityId: str(64),
      summary: str(300),
      method: str(10),
      path: str(300),
      ip: str(64),
      country: str(80),
      browser: str(60),
      os: str(60),
      device: str(40),
    },
    indexes: ['KEY `user` (`user`)', 'KEY `createdAt` (`createdAt`)'],
  },
};

// Every table also has id + createdAt (+ updatedAt with `timestamps`)
for (const def of Object.values(TABLES)) {
  def.columns = { createdAt: { sql: 'DATETIME(3) NOT NULL', kind: 'date' }, ...(def.timestamps && { updatedAt: date() }), ...def.columns };
}

export function createTableSql(name) {
  const { columns, indexes = [] } = TABLES[name];
  const lines = ['`id` CHAR(24) NOT NULL', ...Object.entries(columns).map(([col, c]) => `\`${col}\` ${c.sql}`), 'PRIMARY KEY (`id`)', ...indexes];
  return `CREATE TABLE IF NOT EXISTS \`${name}\` (\n  ${lines.join(',\n  ')}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
}
