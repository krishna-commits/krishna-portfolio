import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

// IMPORTANT: Set AUTH_SECRET in your .env.local file
// Generate a secure random secret: openssl rand -base64 32
// Never commit real secrets to the repository
const secretKey = process.env.AUTH_SECRET || '';
if (!secretKey && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET environment variable is required in production');
}
const key = new TextEncoder().encode(secretKey || 'dev-secret-change-in-production');

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  expiresAt: Date;
}

// Admin credentials from environment variables
// IMPORTANT: Set these in your .env.local file (not committed to git)
// For production, use strong, randomly generated passwords
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

/**
 * Verify admin credentials
 */
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  // In production, use bcrypt to hash passwords
  // For now, simple comparison (update in production)
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

/**
 * Create a session token
 */
export async function createSession(email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({
    userId: email,
    email,
    expiresAt: expires,
  });

  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Read session from cookie
 */
export async function readSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

/**
 * Delete session (logout)
 */
export async function deleteSession() {
  (await cookies()).delete('session');
}

/**
 * Encrypt session payload
 */
async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

/**
 * Decrypt session token
 */
async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionPayload;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await readSession();
  if (!session) return false;
  
  // Check if session is expired
  return new Date(session.expiresAt) > new Date();
}

