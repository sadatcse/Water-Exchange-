import { route } from '@/server/http';
import * as content from '@/server/controllers/content.controller';

export const dynamic = 'force-dynamic';

export const GET = route(content.showMember, { roles: ['admin'] });
export const PUT = route(content.updateMember, { roles: ['admin'] });
export const DELETE = route(content.deleteMember, { roles: ['admin'] });
