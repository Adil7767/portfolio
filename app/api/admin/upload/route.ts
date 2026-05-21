import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { cloudinary, getUploadFolder } from "@/lib/cloudinary-server";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_RAW_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "misc");
  const resourceType = String(formData.get("resourceType") ?? "image");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isRaw = resourceType === "raw";
  const maxSize = isRaw ? MAX_RAW_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      resource_type: string;
      format?: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: getUploadFolder(folder),
          resource_type: isRaw ? "raw" : "image",
          ...(isRaw
            ? { format: "pdf", access_mode: "public" }
            : {
                allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
              }),
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error ?? new Error("Upload failed"));
          else resolve(uploadResult);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
