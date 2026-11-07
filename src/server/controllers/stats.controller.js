// Admin dashboard counters
import { ok } from '@/server/http';
import { toPlain } from '@/server/validate';
import { countUsers } from '@/server/services/user.service';
import ContactMessage from '@/models/ContactMessage';
import Product from '@/models/Product';
import BlogPost from '@/models/BlogPost';
import TeamMember from '@/models/TeamMember';

export async function overview() {
  const [users, messages, unreadMessages, recentMessages, products, posts, team] = await Promise.all([
    countUsers(),
    ContactMessage.count(),
    ContactMessage.count({ status: 'unread' }),
    ContactMessage.find({ orderBy: { createdAt: -1 }, limit: 5 }),
    Product.count({ published: true }),
    BlogPost.count({ published: true }),
    TeamMember.count({ published: true }),
  ]);
  return ok({ users, messages, unreadMessages, recentMessages: toPlain(recentMessages), products, posts, team });
}
