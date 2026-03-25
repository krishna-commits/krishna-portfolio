/**
 * Serverless Postgres via Neon (replaces deprecated @vercel/postgres).
 *
 * Use only in server-side code (API routes, Server Components). Loaded with require()
 * so webpack does not bundle the driver at build time.
 */

type SqlFunction = (strings: TemplateStringsArray, ...values: any[]) => Promise<{ rows: any[] }>;

let sql: SqlFunction | null = null;

/**
 * Tagged-template SQL compatible with prior `getSql()` shape: `{ rows }`.
 */
export function getSql(): SqlFunction | null {
	if (!sql) {
		try {
			const url =
				process.env.POSTGRES_URL ||
				process.env.DATABASE_URL ||
				(process.env.POSTGRES_HOST ? buildUrlFromParts() : null);
			if (!url) {
				return null;
			}

			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const { neon } = require('@neondatabase/serverless') as typeof import('@neondatabase/serverless');
			const raw = neon(url);
			sql = async (strings: TemplateStringsArray, ...values: any[]) => {
				const result = await raw(strings, ...values);
				const rows = Array.isArray(result) ? result : [];
				return { rows };
			};
		} catch {
			return null;
		}
	}
	return sql;
}

function buildUrlFromParts(): string | null {
	const host = process.env.POSTGRES_HOST;
	const user = process.env.POSTGRES_USER;
	const password = process.env.POSTGRES_PASSWORD;
	const database = process.env.POSTGRES_DATABASE;
	if (!host || !user || !database) return null;
	const auth = password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}` : encodeURIComponent(user);
	return `postgres://${auth}@${host}/${database}`;
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
	return getSql() !== null;
}
