import { defineTable } from '../lib/table.js';

// One sign-in attempt (successful or not). Shown in Dashboard → Login History.
// Rows older than 180 days are removed (audit.service.js).
export default defineTable('login_logs');
