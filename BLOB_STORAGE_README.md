# Vercel Blob Storage Integration

This portfolio uses Vercel Blob Storage for all images instead of storing them in the `public/` folder.

## Setup

1. **Install Dependencies**
   ```bash
   npm install @vercel/blob
   ```

2. **Environment Variables**
   Make sure you have `BLOB_READ_WRITE_TOKEN` set in your Vercel project environment variables. This is automatically configured when you enable Vercel Blob Storage in your project.

## Uploading Images

### Option 1: Admin Upload Page (Recommended)

1. Navigate to `/admin/upload-images` in your application
2. Upload single or multiple images
3. Copy the generated Blob URLs
4. Update your configuration files (e.g., `config/site.tsx`) with the new URLs

### Option 2: Using the Upload API Directly

```typescript
import { uploadToBlob } from 'app/lib/blob-utils';

const file = // your file object
const result = await uploadToBlob(file);
console.log(result.url); // Use this URL in your config
```

### Option 3: Using the Example Component

```typescript
'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import { uploadToBlob } from 'app/lib/blob-utils';

export default function ImageUpload() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    const result = await uploadToBlob(file);
    setBlob(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="file" 
        ref={inputFileRef} 
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        required 
      />
      <button type="submit">Upload</button>
      {blob && (
        <div>
          Blob URL: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </form>
  );
}
```

## API Routes

- **`/api/upload`** - Generic image upload endpoint
- **`/api/avatar/upload`** - Avatar/profile image upload endpoint (same functionality)

Both endpoints accept:
- `filename` query parameter (optional, defaults to original filename)
- File in request body

Returns: `PutBlobResult` with `url`, `pathname`, and `size`

## Utilities

### `uploadToBlob(file: File, filename?: string)`
Upload a single file to Vercel Blob Storage.

### `uploadMultipleToBlob(files: File[])`
Upload multiple files at once.

## Migrating Existing Images

1. Go to `/admin/upload-images`
2. Upload all images from your `public/` folder
3. Copy the generated URLs
4. Update references in:
   - `config/site.tsx` (profile_image, certification images, etc.)
   - `app/home/components/hero-section.tsx` (profile image)
   - Any other components using local image paths

## Example Migration

**Before:**
```typescript
profile_image: "/photo.jpg"
imageUrl: "/python-logo.png"
```

**After:**
```typescript
profile_image: "https://[your-blob-url].public.blob.vercel-storage.com/photo-[random].jpg"
imageUrl: "https://[your-blob-url].public.blob.vercel-storage.com/python-logo-[random].png"
```

## Benefits

- **Better Performance**: Images are served from Vercel's global CDN
- **Scalability**: No storage limits in your repository
- **Security**: Fine-grained access control
- **Cost-effective**: Pay only for what you use

