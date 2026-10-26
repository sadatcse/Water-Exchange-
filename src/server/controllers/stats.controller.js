// Admin dashboard counters
import { ok } from '@/server/http';
import { countUsers } from '@/server/services/user.service';
import ContactMessage from '@/models/ContactMessage';
import Product from '@/models/Product';
import BlogPost from '@/models/BlogPost';
import TeamMember from '@/models/TeamMember';

export async function overview() {
  const [users, messages, unreadMessages, recentMessages, products, posts, team] = await Promise.all([
    countUsers(),
    ContactMessage.estimatedDocumentCount(),
    ContactMessage.countDocuments({ status: 'unread' }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    Product.countDocuments({ published: true }),
    BlogPost.countDocuments({ published: true }),
    TeamMember.countDocuments({ published: true }),
  ]);
  return ok({ users, messages, unreadMessages, recentMessages: JSON.parse(JSON.stringify(recentMessages)), products, posts, team });
}
