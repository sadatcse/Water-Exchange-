// Admin dashboard counters
import { ok } from '@/server/http';
import { countUsers } from '@/server/services/user.service';
import ContactMessage from '@/models/ContactMessage';

export async function overview() {
  const [users, messages, unreadMessages, recentMessages] = await Promise.all([
    countUsers(),
    ContactMessage.estimatedDocumentCount(),
    ContactMessage.countDocuments({ status: 'unread' }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  return ok({ users, messages, unreadMessages, recentMessages: JSON.parse(JSON.stringify(recentMessages)) });
}
