import { NextRequest, NextResponse } from 'next/server';
import { readSession } from 'lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await readSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          email: session.email,
          userId: session.userId,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}

