"use client"

import Image from "next/image"
import { Trash2Icon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export type UploadedAsset = {
  url: string
  publicId: string
  fileName: string
}

export function UploadedAssetPreview({
  asset,
  uploading,
  required,
  onPick,
  onRemove,
}: {
  asset: UploadedAsset | null
  uploading: boolean
  required: boolean
  onPick: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {asset ? (
        <Image
          src={asset.url}
          alt="Uploaded file preview"
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
      ) : null}
      {asset?.fileName ? (
        <span className="max-w-48 truncate text-sm text-muted-foreground">
          {asset.fileName}
        </span>
      ) : null}
      <Button
        type="button"
        variant="outline"
        onClick={onPick}
        disabled={uploading}
      >
        {uploading ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <UploadIcon data-icon="inline-start" />
        )}
        {asset ? "Replace" : "Upload"}
      </Button>
      {asset && !required ? (
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2Icon data-icon="inline-start" />
          Remove
        </Button>
      ) : null}
    </div>
  )
}
