import bcrypt from 'bcryptjs';
import { defineTable } from '../lib/table.js';

// Dashboard accounts. Create one with `npm run create-admin`.
export const ROLES = ['admin'];
export const USER_STATUSES = ['active', 'suspended'];
export const MIN_PASSWORD_LENGTH = 8;

// `password` is a bcrypt hash — never send it to the browser (user.service.js toPublicUser)
export const hashPassword = (plain) => bcrypt.hash(String(plain), 12);
export const checkPassword = (user, plain) => bcrypt.compare(String(plain), user.password || '');

// Every column except the password hash
export const PUBLIC_COLUMNS = ['name', 'email', 'role', 'status', 'lastLoginAt', 'createdAt', 'updatedAt'];

export default defineTable('users');
