import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from 'lib/auth';

export async function POST(request: NextRequest) {
  try {
    await deleteSession();

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Auth API] Logout Error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

