import { defineTable } from '../lib/table.js';

export const CONTACT_STATUSES = ['unread', 'read', 'replied'];

export default defineTable('contact_messages');
