import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { findRecentDuplicate } from '@/lib/dedupe-guard';
import { getClientIp } from '@/lib/visitor';
import { isRateLimited } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public: submit the contact form (messages are listed on the dashboard overview)
export async function POST(req) {
  try {
    if (isRateLimited(`contact:${getClientIp(req)}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json({ success: false, message: 'Too many messages. Please try again later.' }, { status: 429 });
    }
    const body = await req.json();
    const data = {
      fullName: String(body.fullName || '').trim().slice(0, 120),
      email: String(body.email || '').trim().toLowerCase().slice(0, 160),
      phone: String(body.phone || '').trim().slice(0, 30),
      subject: String(body.subject || '').trim().slice(0, 200),
      message: String(body.message || '').trim().slice(0, 5000),
    };

    if (!data.fullName || !data.message || !EMAIL_RE.test(data.email)) {
      return NextResponse.json({ success: false, message: 'Name, a valid email and a message are required.' }, { status: 400 });
    }

    await connectDB();
    const existing = await findRecentDuplicate(ContactMessage, { email: data.email, message: data.message });
    if (existing) {
      return NextResponse.json({ success: true, message: 'We already received your message — we will get back to you soon.' });
    }

    await ContactMessage.create(data);
    return NextResponse.json({ success: true, message: 'Thanks! Your message has been sent.' }, { status: 201 });
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}
