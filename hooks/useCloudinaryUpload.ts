// hooks/useCloudinaryUpload.ts
"use client";

import { useState, useCallback } from "react";

interface UploadResult {
  url: string;
  publicId: string;
  duration?: number;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

interface UploadOptions {
  type: "video" | "image" | "document";
  folder?: string;
  onProgress?: (progress: number) => void;
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, options: UploadOptions): Promise<UploadResult> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        // For files larger than 10MB, use direct Cloudinary upload
        if (file.size > 10 * 1024 * 1024) {
          return await directCloudinaryUpload(file, options, (p) => {
            setProgress(p);
            options.onProgress?.(p);
          });
        }

        // For smaller files, use our API route
        return await apiUpload(file, options, (p) => {
          setProgress(p);
          options.onProgress?.(p);
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { upload, uploading, progress, error };
}

// Upload via our API route (for files < 10MB)
async function apiUpload(
  file: File,
  options: UploadOptions,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", options.type);
  formData.append("folder", options.folder || "courses");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            resolve({
              url: response.data.secure_url,
              publicId: response.data.public_id,
              duration: response.data.duration,
              format: response.data.format,
              bytes: response.data.bytes,
              width: response.data.width,
              height: response.data.height,
            });
          } else if (response.useDirectUpload) {
            // Fallback to direct upload
            directCloudinaryUpload(file, options, onProgress)
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error(response.error || "Upload failed"));
          }
        } catch {
          reject(new Error("Invalid response from server"));
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.error || "Upload failed"));
        } catch {
          reject(new Error("Upload failed"));
        }
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    );
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

// Direct upload to Cloudinary (for large files)
async function directCloudinaryUpload(
  file: File,
  options: UploadOptions,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  // Determine folder and resource type
  const folder = options.folder || `courses/${options.type}s`;
  const resourceType = options.type === "document" ? "raw" : options.type;

  // Get signature from our API
  const signatureRes = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder,
      resourceType,
    }),
  });

  if (!signatureRes.ok) {
    const errorData = await signatureRes.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to get upload signature");
  }

  const { data: signatureData } = await signatureRes.json();

  // Build form data for Cloudinary
  // IMPORTANT: Only include the exact parameters that were signed
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp.toString());
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  // Build the Cloudinary upload URL
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            duration: response.duration,
            format: response.format,
            bytes: response.bytes,
            width: response.width,
            height: response.height,
          });
        } else {
          // Cloudinary error response
          const errorMessage = response.error?.message || "Upload failed";
          console.error("Cloudinary upload error:", response);
          reject(new Error(errorMessage));
        }
      } catch {
        reject(new Error("Invalid response from Cloudinary"));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    );
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("POST", cloudinaryUrl);
    xhr.send(formData);
  });
}

export default useCloudinaryUpload;
