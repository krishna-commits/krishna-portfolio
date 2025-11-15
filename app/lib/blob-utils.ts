import type { PutBlobResult } from '@vercel/blob';

/**
 * Upload a file to Vercel Blob Storage
 * @param file - The file to upload
 * @param filename - Optional custom filename. If not provided, uses file.name
 * @param folder - Optional folder path (default: 'public')
 * @returns The PutBlobResult with the blob URL
 */
export async function uploadToBlob(
  file: File,
  filename?: string,
  folder: string = 'public'
): Promise<PutBlobResult> {
  const uploadFilename = filename || file.name;
  const folderParam = folder ? `&folder=${encodeURIComponent(folder)}` : '';
  const response = await fetch(
    `/api/upload?filename=${encodeURIComponent(uploadFilename)}${folderParam}`,
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
 * @param folder - Optional folder path (default: 'public')
 * @returns Array of PutBlobResult objects
 */
export async function uploadMultipleToBlob(
  files: File[],
  folder: string = 'public'
): Promise<PutBlobResult[]> {
  const uploadPromises = files.map((file) => uploadToBlob(file, undefined, folder));
  return Promise.all(uploadPromises);
}

