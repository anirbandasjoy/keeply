import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/session"
import { scanDocumentFromImage } from "@/services/ai/scan-document"

export async function POST(request: Request) {
  await requireUser()

  const body = await request.json().catch(() => ({}))
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : ""

  if (!imageUrl) {
    return NextResponse.json(
      { error: "imageUrl is required" },
      { status: 400 }
    )
  }

  try {
    new URL(imageUrl)
    const result = await scanDocumentFromImage(imageUrl)
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Scan failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
