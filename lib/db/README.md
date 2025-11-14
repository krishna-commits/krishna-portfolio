# Hobbies Database Setup

This document explains how to set up the hobbies database table.

## Database Schema

The hobbies table stores hobby information with the following structure:

- `id`: SERIAL PRIMARY KEY - Unique identifier
- `title`: VARCHAR(255) NOT NULL - Hobby title
- `description`: TEXT - Optional description
- `image_url`: VARCHAR(500) NOT NULL - URL to the hobby image
- `order_index`: INTEGER DEFAULT 0 - Order for display (lower numbers appear first)
- `is_active`: BOOLEAN DEFAULT true - Whether the hobby is visible on the homepage
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP - Creation timestamp
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP - Last update timestamp

## Setup Instructions

### 1. Using Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to the Storage tab
3. Create a new Postgres database (if you don't have one)
4. Run the SQL from `lib/db/hobbies.sql` in the SQL editor:

```sql
-- Create hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on order_index for sorting
CREATE INDEX IF NOT EXISTS idx_hobbies_order ON hobbies(order_index);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_hobbies_active ON hobbies(is_active);
```

### 2. Using Local Postgres

1. Connect to your local Postgres database
2. Run the SQL from `lib/db/hobbies.sql`

```bash
psql -U your_username -d your_database -f lib/db/hobbies.sql
```

### 3. Environment Variables

Make sure you have the following environment variables set:

```env
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
```

## Usage

### Admin Panel

1. Navigate to `/admin/hobbies`
2. Click "Add Hobby" to create a new hobby
3. Upload an image (max 5MB, formats: JPEG, PNG, WebP, GIF)
4. Fill in the title, description, and order index
5. Toggle "Active" to show/hide on homepage
6. Click "Create" to save

### API Endpoints

- `GET /api/hobbies` - Get all active hobbies
- `GET /api/hobbies?includeInactive=true` - Get all hobbies (including inactive)
- `GET /api/hobbies/[id]` - Get a single hobby by ID
- `POST /api/hobbies` - Create a new hobby
- `PUT /api/hobbies/[id]` - Update a hobby
- `DELETE /api/hobbies/[id]` - Delete a hobby
- `POST /api/hobbies/upload` - Upload an image

## Image Storage

Images are stored in the `public/hobbies/` directory. Make sure this directory exists and is writable.

## Homepage Display

The hobbies section is displayed on the homepage automatically. Only hobbies with `is_active = true` are shown, ordered by `order_index` ascending.

