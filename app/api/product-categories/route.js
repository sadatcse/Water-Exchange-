import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const GET = route(content.listCategories, { roles: ['admin'] });
export const POST = route(content.createCategory, { roles: ['admin'] });
