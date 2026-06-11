import apiClient from './client';

interface SignatureResponse {
  timestamp: number;
  signature: string;
  folder: string;
}

/**
 * Uploads a file directly to Cloudinary using a secure signature from the backend.
 * Bypasses the backend to save memory and bandwidth.
 */
export async function uploadToCloudinary(file: File, folder: string = 'tourongo'): Promise<string> {
  // 1. Get secure signature from our backend
  const sigRes = await apiClient.get<SignatureResponse>(`/api/upload/signature?folder=${folder}`);
  const { timestamp, signature } = sigRes.data;

  // 2. Prepare FormData for Cloudinary API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured.');
  }

  // 3. Upload directly to Cloudinary
  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data = await uploadRes.json();
  
  // Return the secure optimized URL
  return data.secure_url;
}
