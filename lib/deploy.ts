// Deploy metadata from Vercel's system environment variables (falls back to "local" in development).
export const deploy = {
  sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
  ref: process.env.VERCEL_GIT_COMMIT_REF ?? "dev",
  env: process.env.VERCEL_ENV ?? "development",
  builtAt: process.env.BUILD_TIME ?? new Date().toISOString(),
};
