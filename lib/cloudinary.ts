// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  duration?: number;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export async function uploadToCloudinary(
  file: File,
  options: {
    folder: string;
    resourceType: "video" | "image" | "raw";
    transformation?: object[];
  }
): Promise<CloudinaryUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: options.resourceType,
        folder: options.folder,
        transformation: options.transformation,
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            duration: result.duration,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadVideo(
  file: File,
  folder = "courses/videos"
): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, { folder, resourceType: "video" });
}

export async function uploadImage(
  file: File,
  folder = "courses/thumbnails"
): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, {
    folder,
    resourceType: "image",
    transformation: [{ width: 1280, height: 720, crop: "fill" }],
  });
}

export async function uploadDocument(
  file: File,
  folder = "courses/documents"
): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, { folder, resourceType: "raw" });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "video" | "image" | "raw" = "video"
): Promise<{ result: string }> {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

export function getPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
