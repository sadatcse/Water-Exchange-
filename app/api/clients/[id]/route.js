import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const GET = route(content.showClient, { roles: ['admin'] });
export const PUT = route(content.updateClient, { roles: ['admin'] });
export const DELETE = route(content.deleteClient, { roles: ['admin'] });
