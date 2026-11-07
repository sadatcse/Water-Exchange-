import { defineTable } from '../lib/table.js';

export const ACTIVITY_ACTIONS = ['create', 'update', 'delete', 'logout', 'password_change'];

// Something a signed-in user did (changed a setting, signed out…).
// Written automatically for every successful change made through the API (src/server/http.js).
// Shown in Dashboard → User Activity. Rows older than 180 days are removed (audit.service.js).
export default defineTable('activity_logs');
