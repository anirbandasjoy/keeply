"use client"

import { useState, useRef, useTransition } from "react"
import { ScanLineIcon, XCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { uploadProductFile } from "./upload-request"
import { pdfToImageFile } from "./pdf-to-image"
import type { ScanDocumentResult } from "@/schemas/scan-document"

type ScanDocumentButtonProps = {
  onScanComplete: (data: ScanDocumentResult, receiptUrl: string, receiptPublicId: string) => void
  disabled?: boolean
}

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
].join(",")

export function ScanDocumentButton({
  onScanComplete,
  disabled,
}: ScanDocumentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleFile(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    setError(null)
    startTransition(async () => {
      try {
        const imageFile = file.type === "application/pdf"
          ? await pdfToImageFile(file)
          : file

        const uploadResult = await uploadProductFile(imageFile, "receipt")
        if (!uploadResult.ok) {
          setError(`Upload failed: ${uploadResult.error}`)
          return
        }

        const res = await fetch("/api/ai/scan-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadResult.url }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? "Scan failed")
          return
        }

        onScanComplete(
          data as ScanDocumentResult,
          uploadResult.url,
          uploadResult.publicId
        )
      } catch {
        setError("Something went wrong")
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="sr-only"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isPending}
        onClick={() => inputRef.current?.click()}
        className="inline-flex w-fit items-center gap-2"
      >
        {isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ScanLineIcon data-icon="inline-start" />
        )}
        {isPending ? "Analyzing document..." : "Scan Document"}
      </Button>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <XCircleIcon className="size-4" />
          {error}
        </p>
      )}
    </div>
  )
}
