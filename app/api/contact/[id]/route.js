import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const PATCH = route(content.updateMessage, { roles: ['admin'] });
export const DELETE = route(content.deleteMessage, { roles: ['admin'] });
