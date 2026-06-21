import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const TAG_POSITION = SALT_LENGTH + IV_LENGTH
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH

function getEncryptionKey(): Buffer {
	const secret = process.env.AUTH_SECRET || 'default-secret-key-change-this-in-production'
	return crypto.scryptSync(secret, 'salt', 32)
}

export function encryptSecret(text: string): string {
	const key = getEncryptionKey()
	const iv = crypto.randomBytes(IV_LENGTH)
	const salt = crypto.randomBytes(SALT_LENGTH)

	const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

	let encrypted = cipher.update(text, 'utf8')
	encrypted = Buffer.concat([encrypted, cipher.final()])
	const tag = cipher.getAuthTag()

	return Buffer.concat([salt, iv, tag, encrypted]).toString('hex')
}

export function decryptSecret(encryptedText: string): string {
	const data = Buffer.from(encryptedText, 'hex')
	const iv = data.subarray(SALT_LENGTH, TAG_POSITION)
	const tag = data.subarray(TAG_POSITION, ENCRYPTED_POSITION)
	const encrypted = data.subarray(ENCRYPTED_POSITION)

	const key = getEncryptionKey()
	const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
	decipher.setAuthTag(tag)

	let decrypted = decipher.update(encrypted)
	decrypted = Buffer.concat([decrypted, decipher.final()])

	return decrypted.toString('utf8')
}

export const SENSITIVE_ENV_KEY_PARTS = [
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
] as const

export function isSensitiveEnvKey(key: string): boolean {
	const lowerKey = key.toLowerCase()
	return SENSITIVE_ENV_KEY_PARTS.some((part) => lowerKey.includes(part))
}

export function maskSecretValue(value: string, maskChar = '*'): string {
	if (!value || value.length <= 8) {
		return maskChar.repeat(8)
	}
	const visibleStart = value.substring(0, 3)
	const visibleEnd = value.substring(value.length - 3)
	const masked = maskChar.repeat(Math.max(0, value.length - 6))
	return `${visibleStart}${masked}${visibleEnd}`
}
