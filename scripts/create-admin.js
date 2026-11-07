// Creates an admin account, or resets the password of an existing one.
//   npm run create-admin -- admin@example.com "StrongPassword123" "Your Name"
// On cPanel (Terminal, inside the app folder): node --env-file=.env scripts/create-admin.js …
import { closeDB } from '../src/lib/db.js';
import User, { MIN_PASSWORD_LENGTH, hashPassword } from '../src/models/User.js';

const [email, password, name = ''] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> <password> [name]');
  process.exit(1);
}
if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  process.exit(1);
}
if (!process.env.DB_USER || !process.env.DB_NAME) {
  console.error('DB_USER / DB_NAME are missing in .env');
  process.exit(1);
}

const address = email.toLowerCase().trim();
const data = { password: await hashPassword(password), role: 'admin', status: 'active', ...(name && { name }) };
const existing = await User.findOne({ email: address });
if (existing) await User.updateById(existing._id, data);
else await User.insert({ ...data, email: address, name: name || address.split('@')[0] });
console.log(`Admin ready: ${address}`);
await closeDB();
