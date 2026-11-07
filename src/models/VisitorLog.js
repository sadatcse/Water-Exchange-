import { defineTable } from '../lib/table.js';

// One visit per browser session (app/api/visitor/log)
export default defineTable('visitor_logs');
