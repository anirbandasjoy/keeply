import type { UploadApiResponse } from "cloudinary"
import { getCloudinary } from "./config"

export type UploadKind = "receipt" | "product_asset"

export type CloudinaryUploadResult = {
  url: string
  publicId: string
}

function uploadFromBuffer(
  buffer: Buffer,
  kind: UploadKind
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const cloudinary = getCloudinary()
    const stream = cloudinary.uploader.upload_stream(
      { folder: `keeply/${kind}` },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"))
          return
        }
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export async function uploadImage(
  file: File,
  kind: UploadKind
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await uploadFromBuffer(buffer, kind)
  return { url: result.secure_url, publicId: result.public_id }
}

export async function destroyImage(publicId: string): Promise<void> {
  try {
    const cloudinary = getCloudinary()
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error(
      `Failed to destroy Cloudinary asset ${publicId}:`,
      error instanceof Error ? error.message : error
    )
  }
}
