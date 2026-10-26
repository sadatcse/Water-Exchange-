import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const GET = route(content.showProduct, { roles: ['admin'] });
export const PUT = route(content.updateProduct, { roles: ['admin'] });
export const DELETE = route(content.deleteProduct, { roles: ['admin'] });
