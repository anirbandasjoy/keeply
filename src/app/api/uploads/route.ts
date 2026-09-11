import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/session"
import {
  uploadImage,
  type UploadKind,
} from "@/services/cloudinary/service"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_KINDS: UploadKind[] = ["receipt", "product_asset"]
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]

export async function POST(request: Request) {
  await requireUser()

  const formData = await request.formData()
  const file = formData.get("file")
  const kind = formData.get("kind")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required" }, { status: 400 })
  }

  if (typeof kind !== "string" || !ALLOWED_KINDS.includes(kind as UploadKind)) {
    return NextResponse.json({ error: "Invalid upload kind" }, { status: 400 })
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File must be between 1 byte and 10MB" },
      { status: 400 }
    )
  }

  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP images and PDF files are allowed" },
      { status: 400 }
    )
  }

  try {
    const result = await uploadImage(file, kind as UploadKind)
    return NextResponse.json({
      url: result.url,
      public_id: result.publicId,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed unexpectedly"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
