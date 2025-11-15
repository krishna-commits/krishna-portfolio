import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        try {
            if (!prisma) {
                // Database not configured - return success anyway (email could be handled externally)
                return NextResponse.json(
                    { message: 'Subscription request received!' },
                    { status: 200 }
                );
            }

            await prisma.newsletterSubscriber.create({
                data: { email },
            });

            return NextResponse.json(
                { message: 'Subscribed successfully!' },
                { status: 200 }
            );
        } catch (dbError: any) {
            // Handle duplicate email error (Prisma unique constraint)
            if (dbError.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Email already subscribed' },
                    { status: 409 }
                );
            }
            throw dbError;
        }
    } catch (error: any) {
        // Return generic error in production, detailed in development
        return NextResponse.json(
            {
                error: process.env.NODE_ENV === 'development'
                    ? error.message || 'Failed to subscribe'
                    : 'Failed to subscribe. Please try again later.'
            },
            { status: 500 }
        );
    }
}
