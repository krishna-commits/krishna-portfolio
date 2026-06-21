import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { resolveDirectDatabaseUrl } from '../lib/db-env'

/** Load .env.local / .env before importing lib/prisma (imports are hoisted). */
export function loadEnvLocal(): void {
	const envLocalPath = path.join(process.cwd(), '.env.local')
	if (fs.existsSync(envLocalPath)) {
		dotenv.config({ path: envLocalPath, override: true })
		console.log('✅ Loaded .env.local')
	}

	const envPath = path.join(process.cwd(), '.env')
	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath })
	}

	if (!process.env.POSTGRES_URL_NON_POOLING && process.env.POSTGRES_URL) {
		process.env.POSTGRES_URL_NON_POOLING = process.env.POSTGRES_URL
	}

	resolveDirectDatabaseUrl()
}
