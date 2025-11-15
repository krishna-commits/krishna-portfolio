import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import crypto from 'crypto';

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

function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
}

function decrypt(encryptedText: string): string {
  try {
    const data = Buffer.from(encryptedText, 'hex');
    const salt = data.subarray(0, SALT_LENGTH);
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
    throw new Error('Decryption failed');
  }
}

export const dynamic = 'force-dynamic';

// Sensitive keys that should be masked when reading
const SENSITIVE_KEYS = [
  'password',
  'secret',
  'token',
  'key',
  'api_key',
  'access_token',
  'refresh_token',
  'private_key',
  'credential',
  'auth_secret',
  'jwt_secret',
  'encryption_key',
  'database_password',
  'postgres_password',
  'db_password',
];

// Protected keys that cannot be modified via admin panel
const PROTECTED_KEYS = [
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'DATABASE_URL',
];

function isSensitive(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
}

function maskValue(value: string, maskChar: string = '*'): string {
  if (!value || value.length <= 8) {
    return maskChar.repeat(8);
  }
  const visibleStart = value.substring(0, 3);
  const visibleEnd = value.substring(value.length - 3);
  const masked = maskChar.repeat(Math.max(0, value.length - 6));
  return `${visibleStart}${masked}${visibleEnd}`;
}

// GET - Get all environment variables (with masking)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const envSettings = await prisma.siteSetting.findMany({
      where: { key: { startsWith: 'env:' } },
      orderBy: { key: 'asc' },
    });

    const envVars = envSettings.map(setting => {
      const key = setting.key.replace('env:', '');
      const rawValue = JSON.parse(setting.value || '{}');
      const isProtected = PROTECTED_KEYS.includes(key);
      const isEncrypted = rawValue.encrypted || isSensitive(key);
      
      // For sensitive values, always mask in the response
      let displayValue = rawValue.value || '';
      if (isEncrypted) {
        displayValue = maskValue(displayValue);
      }
      
      return {
        key,
        value: displayValue,
        masked: isEncrypted,
        protected: isProtected,
        environment: rawValue.environment || 'production',
        description: rawValue.description || '',
        updatedAt: setting.updatedAt,
      };
    });

    // Also include system env vars (from process.env) for reference (masked)
    const systemEnvVars: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        systemEnvVars[key] = process.env[key] || '';
      } else if (isSensitive(key)) {
        systemEnvVars[key] = maskValue(process.env[key] || '');
      }
    });

    return NextResponse.json({
      envVars,
      systemEnvVars,
      protectedKeys: PROTECTED_KEYS,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Env API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch environment variables' },
      { status: 500 }
    );
  }
}

// POST - Create or update environment variable
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { key, value, environment = 'production', description = '' } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Validate key format
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
      return NextResponse.json(
        { error: 'Invalid key format. Must be uppercase letters, numbers, and underscores only, starting with a letter or underscore.' },
        { status: 400 }
      );
    }

    // Check if key is protected
    if (PROTECTED_KEYS.includes(key)) {
      return NextResponse.json(
        { error: 'This key is protected and cannot be modified via the admin panel' },
        { status: 403 }
      );
    }

    // Validate value
    if (typeof value !== 'string' || value.length === 0) {
      return NextResponse.json(
        { error: 'Value must be a non-empty string' },
        { status: 400 }
      );
    }

    // Encrypt sensitive values before storing
    let encryptedValue = value;
    if (isSensitive(key)) {
      encryptedValue = encrypt(value);
    }

    const settingKey = `env:${key}`;
    const settingValue = JSON.stringify({
      value: encryptedValue,
      environment,
      description,
      encrypted: isSensitive(key),
      updatedAt: new Date().toISOString(),
    });

    await prisma.siteSetting.upsert({
      where: { key: settingKey },
      update: { value: settingValue },
      create: {
        key: settingKey,
        value: settingValue,
      },
    });

    return NextResponse.json({
      message: 'Environment variable updated successfully',
      key,
      masked: maskValue(value),
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Env API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update environment variable' },
      { status: 500 }
    );
  }
}

// DELETE - Delete environment variable
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    // Check if key is protected
    if (PROTECTED_KEYS.includes(key)) {
      return NextResponse.json(
        { error: 'This key is protected and cannot be deleted' },
        { status: 403 }
      );
    }

    const settingKey = `env:${key}`;
    await prisma.siteSetting.delete({
      where: { key: settingKey },
    });

    return NextResponse.json({
      message: 'Environment variable deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Env API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete environment variable' },
      { status: 500 }
    );
  }
}

