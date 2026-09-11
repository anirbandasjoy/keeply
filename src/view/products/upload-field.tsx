"use client"

import { useRef, useState } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  UploadedAssetPreview,
  type UploadedAsset,
} from "./uploaded-asset-preview"
import { uploadProductFile, type UploadKind } from "./upload-request"

export type UploadFieldValue = { url: string; publicId: string } | null

type UploadFieldProps = {
  label: string
  kind: UploadKind
  required: boolean
  description?: string
  value: UploadFieldValue
  error?: string
  onChange: (value: UploadFieldValue) => void
}

export function UploadField({
  label,
  kind,
  required,
  description,
  value,
  error,
  onChange,
}: UploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    const result = await uploadProductFile(file, kind)

    if (result.ok) {
      setFileName(file.name)
      onChange({ url: result.url, publicId: result.publicId })
    } else {
      setUploadError(result.error)
    }
    setUploading(false)
    event.target.value = ""
  }

  const inputId = `${kind}-upload`
  const asset: UploadedAsset | null = value
    ? { url: value.url, publicId: value.publicId, fileName }
    : null

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFile}
        disabled={uploading}
      />
      <UploadedAssetPreview
        asset={asset}
        uploading={uploading}
        required={required}
        onPick={() => inputRef.current?.click()}
        onRemove={() => {
          setFileName("")
          onChange(null)
        }}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {uploadError ? <FieldError>{uploadError}</FieldError> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
