import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Dashboard accounts. Create one with `npm run create-admin`.
export const ROLES = ['admin'];
export const USER_STATUSES = ['active', 'suspended'];
export const MIN_PASSWORD_LENGTH = 8;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, maxlength: 160 },
    // bcrypt hash — set the plain password and the pre-save hook hashes it. Excluded from queries unless asked for.
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'admin', index: true },
    status: { type: String, enum: USER_STATUSES, default: 'active' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.checkPassword = function checkPassword(plain) {
  return bcrypt.compare(String(plain), this.password);
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
