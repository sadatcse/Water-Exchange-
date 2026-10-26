import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const GET = route(content.showPost, { roles: ['admin'] });
export const PUT = route(content.updatePost, { roles: ['admin'] });
export const DELETE = route(content.deletePost, { roles: ['admin'] });
