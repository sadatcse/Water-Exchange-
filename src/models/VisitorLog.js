import mongoose from 'mongoose';

const VisitorLogSchema = new mongoose.Schema({
  ip: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  referrer: { type: String, default: '' },
  source: { type: String, enum: ['Direct', 'Search Engine', 'Referral'], default: 'Direct' },
  sourceName: { type: String, default: 'Direct' },
  path: { type: String, default: '/' },
  userAgent: { type: String, default: 'Unknown' },
  // Parsed from the user agent when the visit is logged (older visits may not have them)
  device: { type: String, default: '' },
  browser: { type: String, default: '' },
  os: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.VisitorLog || mongoose.model('VisitorLog', VisitorLogSchema);
