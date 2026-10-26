import { route } from '@/server/http';
import * as media from '@/server/controllers/media.controller';

export const dynamic = 'force-dynamic';

export const DELETE = route(media.remove, { roles: ['admin'] });
