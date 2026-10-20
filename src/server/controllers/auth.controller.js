import { HttpError, ok, readJson } from '@/server/http';
import * as users from '@/server/services/user.service';
import { createSessionToken, clearSessionCookie, setSessionCookie } from '@/lib/session';
import { homeForRole } from '@/lib/auth-guard';
import { getClientIp } from '@/lib/visitor';
import { isRateLimited } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';
import { recordLogin } from '@/server/services/audit.service';
import { createCaptcha, verifyCaptcha } from '@/lib/captcha';

function sessionResponse(user, status = 200, message) {
  const body = { success: true, ...(message && { message }), data: { user: users.toPublicUser(user), redirectTo: homeForRole(user.role) } };
  const response = NextResponse.json(body, { status });
  setSessionCookie(response, createSessionToken(user));
  return response;
}

export async function signIn({ req }) {
  if (!process.env.JWT_SECRET) throw new HttpError(500, 'Server misconfiguration: JWT_SECRET missing.');
  const { email, password, captchaToken, captchaAnswer } = await readJson(req);
  if (isRateLimited(`login:${getClientIp(req)}`)) {
    await recordLogin(req, { email, success: false, reason: 'Too many attempts (rate limited)' });
    throw new HttpError(429, 'Too many attempts. Try again in 15 minutes.');
  }
  if (!email || !password) throw new HttpError(400, 'Email and password are required.');
  if (!verifyCaptcha(captchaToken, captchaAnswer)) {
    await recordLogin(req, { email, success: false, reason: 'Wrong captcha answer' });
    throw new HttpError(400, 'Wrong answer to the math question — try the new one.');
  }
  let user;
  try {
    user = await users.authenticate(email, password);
  } catch (error) {
    await recordLogin(req, { email, success: false, reason: error.status === 403 ? 'Account suspended' : 'Wrong email or password' });
    throw error;
  }
  await recordLogin(req, { email, success: true, user });
  return sessionResponse(user);
}

// GET /api/auth/captcha → { question: '7 + 5', token } for the /login form
export async function captcha() {
  const response = ok(createCaptcha());
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function me({ session }) {
  const user = await users.getUserById(session._id).catch(() => null);
  if (!user || user.status !== 'active') {
    const response = NextResponse.json({ success: false, message: 'Session expired.' }, { status: 401 });
    clearSessionCookie(response);
    return response;
  }
  return ok({ user: users.toPublicUser(user) });
}

export async function logout() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  clearSessionCookie(response);
  return response;
}

export async function changePassword({ req, session }) {
  const { currentPassword, newPassword } = await readJson(req);
  await users.changePassword(session._id, currentPassword, newPassword);
  return ok(undefined, 'Password updated.');
}
