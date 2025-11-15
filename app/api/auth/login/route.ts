import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from 'lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const isValid = await verifyCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await createSession(email);

    return NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Auth API] Login Error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

