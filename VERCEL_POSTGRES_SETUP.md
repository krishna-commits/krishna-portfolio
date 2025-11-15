# Vercel Postgres Setup Guide

## Problem
Your production site is trying to connect to `localhost:5432` which doesn't exist in production. You need to set up Vercel Postgres and configure the connection strings.

## Solution

### Step 1: Create Vercel Postgres Database

1. **Go to your Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `krishna-portfolio` (or your project name)

2. **Navigate to Storage**
   - Click on the **Storage** tab
   - Click **Create Database**
   - Select **Postgres**

3. **Configure Database**
   - Choose a name (e.g., `portfolio-db`)
   - Select a region (closest to your users)
   - Click **Create**

### Step 2: Get Connection Strings

After creating the database, Vercel will automatically add these environment variables:

- `POSTGRES_PRISMA_URL` - For Prisma with connection pooling
- `POSTGRES_URL_NON_POOLING` - Direct connection URL

These are automatically added to your project, but you can verify them:

1. Go to **Settings** → **Environment Variables**
2. Verify these variables exist:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

### Step 3: Push Prisma Schema to Production

Once the environment variables are set, you need to push the schema:

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to your project → **Settings** → **Deployments**
2. Trigger a new deployment (or wait for next deploy)
3. The build will run `prisma generate` automatically

**Option B: Via CLI**
```bash
# Make sure you're in your project directory
cd d:\learning\krishna-portfolio

# Set environment variables locally (for testing)
# Copy from Vercel dashboard → Settings → Environment Variables

# Push schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 4: Verify Connection

1. **Check Vercel Logs**
   - Go to **Deployments** → Select latest deployment → **Functions** tab
   - Check for any database connection errors
   - Should see successful database connections

2. **Test Your Site**
   - Visit: https://krishnaneupane.com
   - Check browser console for any errors
   - The site should work even if database is not connected (falls back to config)

### Step 5: Migrate Data (Optional)

If you want to migrate your local data to production:

1. **Export from Local Database**
   ```bash
   # Connect to local database and export
   pg_dump -U portfolio_user -d portfolio > local_export.sql
   ```

2. **Import to Vercel Postgres**
   - Use Vercel's database management tools
   - Or use `psql` with the connection string

## Important Notes

### Environment Variables in Vercel

Make sure these are set in **Vercel Dashboard** → **Settings** → **Environment Variables**:

- ✅ `POSTGRES_PRISMA_URL` - Automatically added by Vercel Postgres
- ✅ `POSTGRES_URL_NON_POOLING` - Automatically added by Vercel Postgres
- ✅ `AUTH_SECRET` - For authentication
- ✅ `ADMIN_EMAIL` - Admin login email
- ✅ `ADMIN_PASSWORD` - Admin login password
- ✅ `BLOB_READ_WRITE_TOKEN` - For Vercel Blob Storage
- ✅ `RESEND_API_KEY` - For email functionality (if using)

### Connection String Format

Vercel Postgres connection strings look like:
```
postgres://default:password@host:5432/verceldb?sslmode=require
```

NOT like:
```
postgresql://user:pass@localhost:5432/database  ❌
```

### Fallback Behavior

The application is configured to gracefully handle database connection failures:
- **Analytics tracking**: Silently fails, doesn't break user experience
- **Homepage data**: Falls back to `config/site.tsx` if database is unavailable
- **Admin panel**: May show errors, but site still works

## Troubleshooting

### Error: "Can't reach database server at localhost:5432"

**Cause**: Environment variables pointing to localhost instead of Vercel Postgres

**Solution**: 
1. Check Vercel Dashboard → Settings → Environment Variables
2. Make sure `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are set
3. Redeploy your application

### Error: "P1001: Can't reach database server"

**Cause**: Database connection string is wrong or database is not accessible

**Solution**:
1. Verify connection strings in Vercel Dashboard
2. Check if Vercel Postgres database is running
3. Verify network access settings

### Error: "Prisma schema is out of sync"

**Solution**:
```bash
# Run in your project directory
npx prisma db push
npx prisma generate
```

Then commit and push the changes, or trigger a new deployment.

## Quick Check

To verify your database connection is working:

1. Visit: https://krishnaneupane.com/api/homepage/certifications
2. Should return JSON data (either from database or config fallback)
3. Check Vercel logs - should not show connection errors

## After Setup

Once Vercel Postgres is configured:

1. ✅ All database operations will work
2. ✅ Analytics tracking will store data
3. ✅ Admin panel will work fully
4. ✅ Homepage data can be managed from admin panel
5. ✅ No more `localhost:5432` errors

---

**Need Help?**
- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres
- Prisma Docs: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

