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
export function getSql(): SqlFunction {
	if (!sql) {
		try {
			// Check if POSTGRES_URL is configured
			if (!process.env.POSTGRES_URL && !process.env.POSTGRES_HOST) {
				console.warn('[Database] POSTGRES_URL not configured. Database features will be unavailable.');
				throw new Error('Database connection string not configured. Please set POSTGRES_URL environment variable.');
			}

			// Use require() for server-side only imports to avoid webpack bundling
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const postgres = require('@vercel/postgres');
			sql = postgres.sql;
		} catch (error: any) {
			const errorMessage = error?.message || 'Unknown error';
			
			// Provide helpful error messages based on error type
			if (errorMessage.includes('missing_connection_string') || errorMessage.includes('connection string not configured')) {
				// Don't log this as an error in development - it's expected if DB isn't set up
				if (process.env.NODE_ENV === 'development') {
					console.warn('[Database] POSTGRES_URL environment variable not set. Database features are disabled.');
				}
				throw error; // Re-throw to let API routes handle gracefully
			}
			
			if (errorMessage.includes('Client') || errorMessage.includes('Cannot read properties of undefined')) {
				console.error('[Database] Failed to require @vercel/postgres:', error);
				throw new Error(
					'Database client initialization failed. ' +
					'This may be a webpack bundling issue. ' +
					'Please ensure @vercel/postgres and @neondatabase/serverless are in serverComponentsExternalPackages in next.config.js.'
				);
			}
			
			console.error('[Database] Failed to require @vercel/postgres:', error);
			throw new Error(
				`Database connection not available: ${errorMessage}. ` +
				'Please ensure @vercel/postgres is installed and POSTGRES_URL environment variable is configured.'
			);
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
