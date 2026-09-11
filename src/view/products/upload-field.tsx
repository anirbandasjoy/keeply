"use client"

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
import type { UploadKind } from "./upload-request"

export type UploadFieldValue = { url: string; publicId: string } | null

type UploadFieldProps = {
  label: string
  kind: UploadKind
  required: boolean
  description?: string
  value: UploadFieldValue
  previewUrl: string | null
  fileName: string | null
  error?: string
  onFileSelect: (file: File, previewUrl: string) => void
  onClear: () => void
}

export function UploadField({
  label,
  kind,
  required,
  description,
  value,
  previewUrl,
  fileName,
  error,
  onFileSelect,
  onClear,
}: UploadFieldProps) {
  function handleFile(event: React.ChangeEvent<HTMLInputElement>): void {
    const selected = event.target.files?.[0]
    if (selected) {
      const url = URL.createObjectURL(selected)
      onFileSelect(selected, url)
    }
    event.target.value = ""
  }

  const inputId = `${kind}-upload`
  const asset: UploadedAsset | null = previewUrl
    ? { url: previewUrl, publicId: "", fileName: fileName ?? "" }
    : value
      ? { url: value.url, publicId: value.publicId, fileName: "" }
      : null

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFile}
      />
      <UploadedAssetPreview
        asset={asset}
        required={required}
        onPick={() => {
          const input = document.getElementById(inputId) as HTMLInputElement | null
          input?.click()
        }}
        onRemove={onClear}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
