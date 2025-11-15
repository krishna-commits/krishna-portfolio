import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

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
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher rounds = more secure but slower
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Initialize admin user in database (run once to migrate from env vars)
 */
export async function initializeAdminUser(): Promise<void> {
  if (!prisma || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  try {
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!existingUser) {
      const passwordHash = await hashPassword(ADMIN_PASSWORD);
      await prisma.adminUser.create({
        data: {
          email: ADMIN_EMAIL,
          passwordHash,
        },
      });
      console.log('[Auth] Admin user initialized in database');
    }
  } catch (error) {
    console.error('[Auth] Error initializing admin user:', error);
  }
}

/**
 * Verify admin credentials
 * Supports both database (hashed) and environment variable (plain text) for backward compatibility
 */
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  // First, try to find user in database
  if (prisma) {
    try {
      const user = await prisma.adminUser.findUnique({
        where: { email },
      });

      if (user) {
        // Verify against hashed password in database
        return await verifyPassword(password, user.passwordHash);
      }
    } catch (error) {
      console.error('[Auth] Error checking database for user:', error);
    }
  }

  // Fallback to environment variables (for backward compatibility)
  // This allows migration period where database might not have the user yet
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
  try {
    const session = await readSession();
    if (!session) return false;
    
    // Check if session is expired
    return new Date(session.expiresAt) > new Date();
  } catch (error) {
    // If cookies() fails (e.g., during build), return false
    console.error('[Auth] Error checking authentication:', error);
    return false;
  }
}

