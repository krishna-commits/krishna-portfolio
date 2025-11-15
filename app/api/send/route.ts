import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route segment config - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getResend = async () => {
  const { Resend } = await import('resend');
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(resendApiKey);
};

const getEmailTemplate = async () => {
  const { default: MessageUsEmail } = await import('./email-template');
  return MessageUsEmail;
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, phone, country, company } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Message length validation
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be less than 5000 characters' },
        { status: 400 }
      );
    }

    // Lazy load Resend and email template
    const resend = await getResend();
    const MessageUsEmail = await getEmailTemplate();

    const data = await resend.emails.send({
      from: `${name} <portfolio@neupanekrishna.com.np>`,
      to: ['neupanekrishna33@gmail.com'],
      subject: `${name} has a message!`,
      react: MessageUsEmail({ name, email, message, phone, country, company }),
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development'
          ? error.message || 'Failed to send message'
          : 'Failed to send message. Please try again later.'
      },
      { status: 500 }
    );
  }
}
