import { defineTable } from '../lib/table.js';

// Uploaded images (Dashboard → Media). The file itself lives in UPLOAD_DIR on the server (see media.service.js)
// and is served at `url` (/uploads/…).
export default defineTable('media');
