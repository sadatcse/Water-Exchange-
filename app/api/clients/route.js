import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const GET = route(content.listClients, { roles: ['admin'] });
export const POST = route(content.createClient, { roles: ['admin'] });
