// One-time move from MongoDB Atlas to MariaDB, step 1 (on a computer that can reach Atlas):
//   npm run export-mongo
// Writes mongo-export.json (every collection; ids and dates as strings). `npm run build:cpanel-env` puts it in
// the cPanel package, and the site imports it into the empty MariaDB tables on first start (src/lib/db.js).
// The file holds password hashes and messages — keep it private (it is git-ignored).
import fs from 'node:fs';
import { MongoClient, ObjectId } from 'mongodb';

// Mongoose collection name → MariaDB table
const COLLECTIONS = {
  users: 'users',
  products: 'products',
  productcategories: 'product_categories',
  blogposts: 'blog_posts',
  teammembers: 'team_members',
  clients: 'clients',
  contactmessages: 'contact_messages',
  media: 'media',
  settings: 'settings',
  visitorlogs: 'visitor_logs',
  loginlogs: 'login_logs',
  activitylogs: 'activity_logs',
};

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

// ObjectIds → hex strings, Dates → ISO strings, everything else as is
const plain = (value) => {
  if (value instanceof ObjectId) return value.toHexString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]));
  return value;
};

const client = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
await client.connect();
const db = client.db();
const out = { exportedAt: new Date().toISOString(), tables: {} };
for (const [collection, table] of Object.entries(COLLECTIONS)) {
  const docs = await db.collection(collection).find().toArray();
  out.tables[table] = docs.map(({ __v, ...doc }) => plain(doc));
  console.log(`${table}: ${docs.length}`);
}
await client.close();
fs.writeFileSync('mongo-export.json', JSON.stringify(out));
console.log(`\n✔ mongo-export.json written (${(fs.statSync('mongo-export.json').size / 1024).toFixed(0)} KB)`);
