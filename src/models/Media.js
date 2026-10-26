import mongoose from 'mongoose';

// Uploaded images (Dashboard → Media). The file itself lives in UPLOAD_DIR on the server (see media.service.js)
// and is served at `url` (/uploads/…).
const MediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true }, // /uploads/2026/10/roots-blower-a1b2c3.webp
    file: { type: String, required: true }, // path inside UPLOAD_DIR: 2026/10/roots-blower-a1b2c3.webp
    name: { type: String, default: '', trim: true, maxlength: 200 }, // original file name
    type: { type: String, required: true }, // image/webp | image/png | image/jpeg | image/gif
    size: { type: Number, default: 0 }, // bytes
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

MediaSchema.index({ createdAt: -1 });

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
