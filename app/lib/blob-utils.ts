import type { PutBlobResult } from '@vercel/blob';

/**
 * Upload a file to Vercel Blob Storage
 * @param file - The file to upload
 * @param filename - Optional custom filename. If not provided, uses file.name
 * @returns The PutBlobResult with the blob URL
 */
export async function uploadToBlob(
  file: File,
  filename?: string
): Promise<PutBlobResult> {
  const uploadFilename = filename || file.name;
  const response = await fetch(
    `/api/upload?filename=${encodeURIComponent(uploadFilename)}`,
    {
      method: 'POST',
      body: file,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload file');
  }

  const result = (await response.json()) as PutBlobResult;
  return result;
}

/**
 * Upload multiple files to Vercel Blob Storage
 * @param files - Array of files to upload
 * @returns Array of PutBlobResult objects
 */
export async function uploadMultipleToBlob(
  files: File[]
): Promise<PutBlobResult[]> {
  const uploadPromises = files.map((file) => uploadToBlob(file));
  return Promise.all(uploadPromises);
}

