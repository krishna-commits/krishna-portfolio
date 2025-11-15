/**
 * Example auth configuration file
 * 
 * IMPORTANT: This file is a template. Copy your actual auth.ts file locally.
 * 
 * The actual lib/auth.ts file should:
 * 1. Use environment variables for all sensitive data
 * 2. Never contain hardcoded credentials
 * 3. Use secure defaults that fail safely in production
 * 
 * Required environment variables:
 * - AUTH_SECRET: Secret key for JWT signing (generate with: openssl rand -base64 32)
 * - ADMIN_EMAIL: Admin user email address
 * - ADMIN_PASSWORD: Admin user password (should be hashed in production)
 * 
 * Set these in your .env.local file (not committed to git)
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: Date;
}

// Get secret from environment variable
const secretKey = process.env.AUTH_SECRET || '';
const key = new TextEncoder().encode(secretKey || 'dev-secret-change-in-production');

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function createSession(email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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

export async function readSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete('session');
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionPayload;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await readSession();
  if (!session) return false;
  
  return new Date(session.expiresAt) > new Date();
}

