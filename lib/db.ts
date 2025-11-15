/**
 * Database utility for Vercel Postgres
 * 
 * IMPORTANT: This module must only be imported in server-side code (API routes, Server Components)
 * 
 * The @vercel/postgres package uses @neondatabase/serverless which requires Node.js APIs
 * that aren't available during webpack bundling. By using require() instead of import,
 * we ensure the package is loaded at runtime, not build time.
 */

// Type for the sql function from @vercel/postgres
type SqlFunction = (strings: TemplateStringsArray, ...values: any[]) => Promise<{ rows: any[] }>;

let sql: SqlFunction | null = null;

/**
 * Get the SQL function from @vercel/postgres
 * Uses require() to ensure the package is loaded at runtime, not build time
 */
export function getSql(): SqlFunction | null {
	if (!sql) {
		try {
			// Check if POSTGRES_URL is configured
			if (!process.env.POSTGRES_URL && !process.env.POSTGRES_HOST) {
				// Silently return null - no database configured
				return null;
			}

			// Use require() for server-side only imports to avoid webpack bundling
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const postgres = require('@vercel/postgres');
			sql = postgres.sql;
		} catch (error: any) {
			// Silently fail - database is optional
			return null;
		}
	}
	return sql;
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
	try {
		getSql();
		return true;
	} catch {
		return false;
	}
}
