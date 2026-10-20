// Dashboard accounts (admins). New admins are created with `npm run create-admin`.
import User, { MIN_PASSWORD_LENGTH } from '@/models/User';
import { HttpError } from '@/server/http';
import { str, toPlain } from '@/server/validate';
import mongoose from 'mongoose';

export function toPublicUser(user) {
  const { _id, name, email, role, status, lastLoginAt, createdAt } = user;
  return toPlain({ _id, name, email, role, status: status || 'active', lastLoginAt, createdAt });
}

export async function authenticate(email, password) {
  const user = await User.findOne({ email: str(email, 160).toLowerCase() }).select('+password');
  if (!user || !(await user.checkPassword(password))) throw new HttpError(401, 'Incorrect email or password.');
  // Checked after the password, so only the account owner learns the status
  if (user.status === 'suspended') throw new HttpError(403, 'This account is suspended.');
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

export async function getUserById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpError(400, 'Invalid user id.');
  const user = await User.findById(id).lean();
  if (!user) throw new HttpError(404, 'User not found.');
  return user;
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new HttpError(404, 'User not found.');
  if (!(await user.checkPassword(currentPassword || ''))) throw new HttpError(400, 'Current password is incorrect.');
  if (String(newPassword || '').length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  user.password = String(newPassword);
  await user.save();
}

export async function countUsers() {
  return User.countDocuments();
}
