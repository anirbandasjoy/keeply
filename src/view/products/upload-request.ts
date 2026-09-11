export type UploadKind = "receipt" | "product_asset"

export type UploadRequestResult =
  | { ok: true; url: string; publicId: string }
  | { ok: false; error: string }

export async function uploadProductFile(
  file: File,
  kind: UploadKind
): Promise<UploadRequestResult> {
  try {
    const body = new FormData()
    body.set("file", file)
    body.set("kind", kind)

    const response = await fetch("/api/uploads", { method: "POST", body })
    const data: unknown = await response.json()

    if (
      !response.ok ||
      typeof data !== "object" ||
      data === null ||
      !("url" in data) ||
      !("public_id" in data)
    ) {
      const error =
        typeof data === "object" && data !== null && "error" in data
          ? String((data as { error: unknown }).error)
          : "Upload failed"
      return { ok: false, error }
    }

    const { url, public_id } = data as { url: string; public_id: string }
    return { ok: true, url, publicId: public_id }
  } catch {
    return { ok: false, error: "Upload failed" }
  }
}
