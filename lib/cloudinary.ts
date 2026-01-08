// lib/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";

// ============================================
// CONFIGURATION
// ============================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ============================================
// TYPES
// ============================================

export type UploadFolder =
  | "avatars"
  | "thumbnails"
  | "videos"
  | "documents"
  | "certificates"
  | "badges"
  | "organizations"
  | "lessons"
  | "assessments";

export type ResourceType = "image" | "video" | "raw" | "auto";

export interface UploadOptions {
  folder?: UploadFolder;
  publicId?: string;
  resourceType?: ResourceType;
  transformation?: Record<string, unknown>;
  tags?: string[];
  context?: Record<string, string>;
  overwrite?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

// ============================================
// FOLDER PATHS
// ============================================

const getFolderPath = (folder: UploadFolder): string => {
  const basePath = "thinkhall";
  return `${basePath}/${folder}`;
};

// ============================================
// UPLOAD FUNCTIONS
// ============================================

/**
 * Upload a file from base64 string
 */
export async function uploadBase64(
  base64Data: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const folder = options.folder || "documents";
    const resourceType = options.resourceType || "auto";

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: getFolderPath(folder),
      public_id: options.publicId,
      resource_type: resourceType,
      transformation: options.transformation,
      tags: options.tags,
      context: options.context,
      overwrite: options.overwrite ?? true,
    });

    return {
      success: true,
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      duration: result.duration,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload a file from URL
 */
export async function uploadFromUrl(
  url: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const folder = options.folder || "documents";
    const resourceType = options.resourceType || "auto";

    const result = await cloudinary.uploader.upload(url, {
      folder: getFolderPath(folder),
      public_id: options.publicId,
      resource_type: resourceType,
      transformation: options.transformation,
      tags: options.tags,
      context: options.context,
      overwrite: options.overwrite ?? true,
    });

    return {
      success: true,
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      duration: result.duration,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload a file buffer (for server-side uploads)
 */
export async function uploadBuffer(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const folder = options.folder || "documents";
    const resourceType = options.resourceType || "auto";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: getFolderPath(folder),
        public_id: options.publicId,
        resource_type: resourceType,
        transformation: options.transformation,
        tags: options.tags,
        context: options.context,
        overwrite: options.overwrite ?? true,
      },
      (error, result) => {
        if (error || !result) {
          resolve({
            success: false,
            error: error?.message || "Upload failed",
          });
          return;
        }

        resolve({
          success: true,
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          duration: result.duration,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

// ============================================
// SPECIALIZED UPLOAD FUNCTIONS
// ============================================

/**
 * Upload user avatar with automatic transformation
 */
export async function uploadAvatar(
  data: string | Buffer,
  userId: string
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder: "avatars",
    publicId: `avatar_${userId}`,
    resourceType: "image",
    transformation: {
      width: 400,
      height: 400,
      crop: "fill",
      gravity: "face",
      quality: "auto",
      format: "webp",
    },
    overwrite: true,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

/**
 * Upload course thumbnail with automatic transformation
 */
export async function uploadCourseThumbnail(
  data: string | Buffer,
  courseId: string
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder: "thumbnails",
    publicId: `course_${courseId}`,
    resourceType: "image",
    transformation: {
      width: 800,
      height: 450,
      crop: "fill",
      quality: "auto",
      format: "webp",
    },
    overwrite: true,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

/**
 * Upload organization logo with automatic transformation
 */
export async function uploadOrgLogo(
  data: string | Buffer,
  orgId: string
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder: "organizations",
    publicId: `logo_${orgId}`,
    resourceType: "image",
    transformation: {
      width: 500,
      height: 500,
      crop: "fit",
      quality: "auto",
      format: "webp",
    },
    overwrite: true,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

/**
 * Upload lesson video
 */
export async function uploadLessonVideo(
  data: string | Buffer,
  lessonId: string
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder: "videos",
    publicId: `lesson_${lessonId}`,
    resourceType: "video",
    transformation: {
      quality: "auto",
      format: "mp4",
    },
    overwrite: true,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

/**
 * Upload document (PDF, DOCX, etc.)
 */
export async function uploadDocument(
  data: string | Buffer,
  fileName: string,
  folder: UploadFolder = "documents"
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder,
    publicId: `doc_${Date.now()}_${fileName.replace(/\.[^/.]+$/, "")}`,
    resourceType: "raw",
    overwrite: false,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

/**
 * Upload badge icon
 */
export async function uploadBadgeIcon(
  data: string | Buffer,
  badgeId: string
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder: "badges",
    publicId: `badge_${badgeId}`,
    resourceType: "image",
    transformation: {
      width: 200,
      height: 200,
      crop: "fit",
      quality: "auto",
      format: "webp",
    },
    overwrite: true,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

/**
 * Upload certificate template
 */
export async function uploadCertificateTemplate(
  data: string | Buffer,
  templateId: string
): Promise<UploadResult> {
  const options: UploadOptions = {
    folder: "certificates",
    publicId: `template_${templateId}`,
    resourceType: "image",
    transformation: {
      width: 1200,
      height: 850,
      crop: "fit",
      quality: "auto",
      format: "webp",
    },
    overwrite: true,
  };

  if (Buffer.isBuffer(data)) {
    return uploadBuffer(data, options);
  }
  return uploadBase64(data, options);
}

// ============================================
// DELETE FUNCTIONS
// ============================================

/**
 * Delete a file by public ID
 */
export async function deleteFile(
  publicId: string,
  resourceType: ResourceType = "image"
): Promise<DeleteResult> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

/**
 * Delete multiple files
 */
export async function deleteFiles(
  publicIds: string[],
  resourceType: ResourceType = "image"
): Promise<DeleteResult> {
  try {
    await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });

    return { success: true };
  } catch (error) {
    console.error("Cloudinary bulk delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bulk delete failed",
    };
  }
}

/**
 * Delete all files in a folder
 */
export async function deleteFolder(
  folder: UploadFolder
): Promise<DeleteResult> {
  try {
    const folderPath = getFolderPath(folder);

    // Delete all resources in folder
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    // Delete the folder itself
    await cloudinary.api.delete_folder(folderPath);

    return { success: true };
  } catch (error) {
    console.error("Cloudinary folder delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Folder delete failed",
    };
  }
}

// ============================================
// URL GENERATION
// ============================================

/**
 * Generate optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: {
      width: options.width,
      height: options.height,
      crop: options.crop || "fill",
      quality: options.quality || "auto",
      format: options.format || "webp",
      fetch_format: "auto",
    },
  });
}

/**
 * Generate video thumbnail URL
 */
export function getVideoThumbnailUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    startOffset?: number;
  } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: "video",
    transformation: {
      width: options.width || 800,
      height: options.height || 450,
      crop: "fill",
      start_offset: options.startOffset || 0,
      format: "jpg",
    },
  });
}

/**
 * Generate signed URL for private/protected files
 */
export function getSignedUrl(
  publicId: string,
  resourceType: ResourceType = "image",
  expiresInSeconds = 3600
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType,
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[^.]+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes("cloudinary.com") || url.includes("res.cloudinary.com");
}

/**
 * Get file info from Cloudinary
 */
export async function getFileInfo(
  publicId: string,
  resourceType: ResourceType = "image"
): Promise<Record<string, unknown> | null> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch {
    return null;
  }
}

// ============================================
// EXPORT CLOUDINARY INSTANCE
// ============================================

export { cloudinary };

export default {
  uploadBase64,
  uploadFromUrl,
  uploadBuffer,
  uploadAvatar,
  uploadCourseThumbnail,
  uploadOrgLogo,
  uploadLessonVideo,
  uploadDocument,
  uploadBadgeIcon,
  uploadCertificateTemplate,
  deleteFile,
  deleteFiles,
  deleteFolder,
  getOptimizedImageUrl,
  getVideoThumbnailUrl,
  getSignedUrl,
  extractPublicId,
  isCloudinaryUrl,
  getFileInfo,
};
