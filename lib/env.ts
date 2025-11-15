import { prisma } from './prisma';
import crypto from 'crypto';

const ENV_CACHE: Map<string, { value: string; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

function getEncryptionKey(): Buffer {
  const secret = process.env.AUTH_SECRET || 'default-secret-key-change-this-in-production';
  return crypto.scryptSync(secret, 'salt', 32);
}

// Decrypt sensitive values
function decryptValue(encryptedValue: string): string {
  // Check if it looks like encrypted data (hex string of sufficient length)
  if (!encryptedValue || encryptedValue.length < ENCRYPTED_POSITION * 2) {
    return encryptedValue; // Not encrypted or invalid
  }

  try {
    // Try to decrypt - if it fails, return original value
    const data = Buffer.from(encryptedValue, 'hex');
    if (data.length < ENCRYPTED_POSITION) {
      return encryptedValue; // Invalid encrypted data
    }
    
    const iv = data.subarray(SALT_LENGTH, TAG_POSITION);
    const tag = data.subarray(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = data.subarray(ENCRYPTED_POSITION);
    
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('[Env Decrypt] Error:', error);
    return encryptedValue; // Return original if decryption fails
  }
}

/**
 * Get environment variable from database or fallback to process.env
 * This ensures sensitive keys are never exposed to the frontend
 */
export async function getEnvVar(key: string): Promise<string | undefined> {
  // Check cache first
  const cached = ENV_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }

  // Try database first (for managed env vars)
  try {
    if (prisma) {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: `env:${key}` },
      });

      if (setting) {
        const data = JSON.parse(setting.value || '{}');
        let value = data.value || '';

        // Decrypt if marked as encrypted
        if (data.encrypted && typeof value === 'string') {
          value = decryptValue(value);
        }

        // Cache the value
        ENV_CACHE.set(key, { value, timestamp: Date.now() });
        return value;
      }
    }
  } catch (error) {
    console.error(`[Env] Error fetching ${key} from database:`, error);
  }

  // Fallback to process.env
  const envValue = process.env[key];
  if (envValue) {
    ENV_CACHE.set(key, { value: envValue, timestamp: Date.now() });
  }
  return envValue;
}

/**
 * Get multiple environment variables at once
 */
export async function getEnvVars(keys: string[]): Promise<Record<string, string | undefined>> {
  const results: Record<string, string | undefined> = {};
  
  await Promise.all(
    keys.map(async (key) => {
      results[key] = await getEnvVar(key);
    })
  );

  return results;
}

/**
 * Clear environment variable cache
 */
export function clearEnvCache(): void {
  ENV_CACHE.clear();
}

/**
 * Get environment variable synchronously (for server-side only)
 * Use this when you can't use async/await
 */
export function getEnvVarSync(key: string): string | undefined {
  // For sync access, only use process.env
  // Database access requires async, so this is a fallback
  return process.env[key];
}

