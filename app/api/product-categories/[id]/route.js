import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const PUT = route(content.updateCategory, { roles: ['admin'] });
export const DELETE = route(content.deleteCategory, { roles: ['admin'] });
