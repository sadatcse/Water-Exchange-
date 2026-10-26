import { route } from '@/server/http';
import * as email from '@/server/controllers/email.controller';

export const dynamic = 'force-dynamic';
// Building and sending two reports can take a while on shared hosting
export const maxDuration = 60;

// Public URL guarded by CRON_SECRET (see DEPLOY-CPANEL.md → Cron job)
export const GET = route(email.cron);
