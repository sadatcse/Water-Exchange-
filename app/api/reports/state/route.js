import { route } from '@/server/http';
import * as email from '@/server/controllers/email.controller';

export const dynamic = 'force-dynamic';

export const GET = route(email.state, { roles: ['admin'] });
