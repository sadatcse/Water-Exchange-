// Dashboard accounts (admins). New admins are created with `npm run create-admin`.
import User, { MIN_PASSWORD_LENGTH, PUBLIC_COLUMNS, hashPassword, checkPassword } from '@/models/User';
import { HttpError } from '@/server/http';
import { str, toPlain } from '@/server/validate';

const ID_RE = /^[a-f0-9]{24}$/;

export function toPublicUser(user) {
  const { _id, name, email, role, status, lastLoginAt, createdAt } = user;
  return toPlain({ _id, name, email, role, status: status || 'active', lastLoginAt, createdAt });
}

export async function authenticate(email, password) {
  const user = await User.findOne({ email: str(email, 160).toLowerCase() });
  if (!user || !(await checkPassword(user, password))) throw new HttpError(401, 'Incorrect email or password.');
  // Checked after the password, so only the account owner learns the status
  if (user.status === 'suspended') throw new HttpError(403, 'This account is suspended.');
  const lastLoginAt = new Date();
  await User.updateById(user._id, { lastLoginAt });
  const { password: _hash, ...rest } = user;
  return { ...rest, lastLoginAt };
}

export async function getUserById(id) {
  if (!ID_RE.test(String(id))) throw new HttpError(400, 'Invalid user id.');
  const user = await User.findById(id, { columns: PUBLIC_COLUMNS });
  if (!user) throw new HttpError(404, 'User not found.');
  return user;
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, 'User not found.');
  if (!(await checkPassword(user, currentPassword || ''))) throw new HttpError(400, 'Current password is incorrect.');
  if (String(newPassword || '').length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  await User.updateById(user._id, { password: await hashPassword(newPassword) });
}

export async function countUsers() {
  return User.count();
}
