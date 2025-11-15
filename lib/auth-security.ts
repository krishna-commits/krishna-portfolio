/**
 * Authentication Security Utilities
 * Provides rate limiting, account lockout, and login attempt logging
 */

import { prisma } from './prisma';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5, // Maximum failed attempts before lockout
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  WINDOW_DURATION: 15 * 60 * 1000, // 15 minutes window for rate limiting
};

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Check various headers for IP (handles proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || null;
}

/**
 * Check if account is locked
 */
export async function isAccountLocked(email: string): Promise<{ locked: boolean; lockedUntil?: Date }> {
  if (!prisma) {
    return { locked: false };
  }

  try {
    const lockout = await prisma.accountLockout.findUnique({
      where: { email },
    });

    if (!lockout) {
      return { locked: false };
    }

    // Check if lockout has expired
    if (new Date() > lockout.lockedUntil) {
      // Lockout expired, remove it
      await prisma.accountLockout.delete({
        where: { email },
      });
      return { locked: false };
    }

    return { locked: true, lockedUntil: lockout.lockedUntil };
  } catch (error) {
    console.error('[Auth Security] Error checking account lockout:', error);
    return { locked: false };
  }
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(
  email: string,
  ipAddress: string,
  userAgent: string | null,
  reason: string
): Promise<void> {
  if (!prisma) return;

  try {
    // Log the attempt
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success: false,
        reason,
      },
    });

    // Check recent failed attempts
    const recentAttempts = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_CONFIG.WINDOW_DURATION),
        },
      },
    });

    // Lock account if too many failed attempts
    if (recentAttempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + RATE_LIMIT_CONFIG.LOCKOUT_DURATION);
      
      await prisma.accountLockout.upsert({
        where: { email },
        update: {
          lockedUntil,
          attempts: recentAttempts,
          ipAddress,
          updatedAt: new Date(),
        },
        create: {
          email,
          ipAddress,
          lockedUntil,
          attempts: recentAttempts,
        },
      });
    }
  } catch (error) {
    console.error('[Auth Security] Error recording failed attempt:', error);
  }
}

/**
 * Record a successful login attempt
 */
export async function recordSuccessfulAttempt(
  email: string,
  ipAddress: string,
  userAgent: string | null
): Promise<void> {
  if (!prisma) return;

  try {
    // Log the successful attempt
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success: true,
      },
    });

    // Remove lockout if exists
    await prisma.accountLockout.deleteMany({
      where: { email },
    });

    // Update admin user last login (if using AdminUser model)
    try {
      await prisma.adminUser.updateMany({
        where: { email },
        data: {
          lastLogin: new Date(),
          lastLoginIp: ipAddress,
        },
      });
    } catch {
      // AdminUser might not exist yet, that's okay
    }
  } catch (error) {
    console.error('[Auth Security] Error recording successful attempt:', error);
  }
}

/**
 * Check rate limit for IP address
 */
export async function checkIpRateLimit(ipAddress: string): Promise<{ allowed: boolean; remaining?: number }> {
  if (!prisma) {
    return { allowed: true };
  }

  try {
    const windowStart = new Date(Date.now() - RATE_LIMIT_CONFIG.WINDOW_DURATION);
    
    const recentAttempts = await prisma.loginAttempt.count({
      where: {
        ipAddress,
        success: false,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    const maxAttempts = RATE_LIMIT_CONFIG.MAX_ATTEMPTS * 2; // Allow more attempts per IP
    const remaining = Math.max(0, maxAttempts - recentAttempts);

    return {
      allowed: recentAttempts < maxAttempts,
      remaining,
    };
  } catch (error) {
    console.error('[Auth Security] Error checking IP rate limit:', error);
    return { allowed: true };
  }
}

/**
 * Clean up old login attempts (run periodically)
 */
export async function cleanupOldAttempts(daysToKeep: number = 30): Promise<void> {
  if (!prisma) return;

  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    await prisma.loginAttempt.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    // Also clean up expired lockouts
    await prisma.accountLockout.deleteMany({
      where: {
        lockedUntil: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('[Auth Security] Error cleaning up old attempts:', error);
  }
}

