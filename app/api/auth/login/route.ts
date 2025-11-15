import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route segment config - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getAuthFunctions = async () => {
  const { verifyCredentials, createSession } = await import('lib/auth');
  const {
    getClientIp,
    getUserAgent,
    isAccountLocked,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    checkIpRateLimit,
  } = await import('lib/auth-security');
  return {
    verifyCredentials,
    createSession,
    getClientIp,
    getUserAgent,
    isAccountLocked,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    checkIpRateLimit,
  };
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const {
      verifyCredentials,
      createSession,
      getClientIp,
      getUserAgent,
      isAccountLocked,
      recordFailedAttempt,
      recordSuccessfulAttempt,
      checkIpRateLimit,
    } = await getAuthFunctions();

    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    // Check IP rate limit
    const ipRateLimit = await checkIpRateLimit(ipAddress);
    if (!ipRateLimit.allowed) {
      await recordFailedAttempt(email, ipAddress, userAgent, 'IP rate limit exceeded');
      return NextResponse.json(
        {
          error: 'Too many login attempts from this IP. Please try again later.',
          retryAfter: 15, // minutes
        },
        { status: 429 }
      );
    }

    // Check if account is locked
    const lockoutStatus = await isAccountLocked(email);
    if (lockoutStatus.locked) {
      const minutesRemaining = Math.ceil(
        (lockoutStatus.lockedUntil!.getTime() - Date.now()) / (60 * 1000)
      );
      await recordFailedAttempt(email, ipAddress, userAgent, 'Account locked');
      return NextResponse.json(
        {
          error: `Account is temporarily locked due to too many failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
          lockedUntil: lockoutStatus.lockedUntil,
        },
        { status: 423 } // 423 Locked
      );
    }

    // Verify credentials
    const isValid = await verifyCredentials(email, password);

    if (!isValid) {
      await recordFailedAttempt(email, ipAddress, userAgent, 'Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Successful login
    await recordSuccessfulAttempt(email, ipAddress, userAgent);
    await createSession(email);

    return NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Auth API] Login Error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

