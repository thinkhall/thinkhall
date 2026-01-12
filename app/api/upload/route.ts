// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from "cloudinary";
import { Buffer } from "buffer"; // Still needed for Buffer.from().toString('base64')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error(
        "Cloudinary credentials are not fully set in environment variables."
      );
      return NextResponse.json(
        {
          error:
            "Cloudinary configuration missing on the server. Please check environment variables.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const typeInput = (formData.get("type") as string) || "auto";
    const folder = (formData.get("folder") as string) || "courses";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const MAX_FILE_SIZE_API = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE_API) {
      return NextResponse.json(
        {
          error: "File too large for direct API upload. Use direct upload.",
          useDirectUpload: true,
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    // Revert to converting the ArrayBuffer to a Base64 Data URI string.
    // This is the expected format for `cloudinary.uploader.upload` when
    // providing raw binary data from memory, according to its TypeScript types.
    const base64File = `data:${file.type};base64,${Buffer.from(bytes).toString(
      "base64"
    )}`;

    let resourceType: UploadApiOptions["resource_type"] = "raw";
    if (typeInput === "video") resourceType = "video";
    else if (typeInput === "image") resourceType = "image";

    const uploadOptions: UploadApiOptions = {
      resource_type: resourceType,
      folder: folder,
    };

    if (typeInput === "image") {
      uploadOptions.transformation = [
        { width: 1280, height: 720, crop: "fill" },
      ];
    }

    // Now, `base64File` is a string, which matches the expected type for `uploader.upload`
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      base64File, // Pass the Base64 Data URI string
      uploadOptions
    );

    return NextResponse.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: result.duration, // Only for video
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
