import { route } from '@/server/http';
import * as email from '@/server/controllers/email.controller';

export const dynamic = 'force-dynamic';

export const POST = route(email.sendNow, { roles: ['admin'] });
