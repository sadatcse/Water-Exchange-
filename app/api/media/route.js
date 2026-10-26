import { route } from '@/server/http';
import * as media from '@/server/controllers/media.controller';

export const dynamic = 'force-dynamic';

export const GET = route(media.list, { roles: ['admin'] });
export const POST = route(media.upload, { roles: ['admin'] });
