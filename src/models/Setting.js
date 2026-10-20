import mongoose from 'mongoose';

// Small site-wide settings documents edited from the dashboard, one per key:
//   'site' → timezone
const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
