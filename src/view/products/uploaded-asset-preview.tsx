"use client"

import Image from "next/image"
import { Trash2Icon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type UploadedAsset = {
  url: string
  publicId: string
  fileName: string
}

export function UploadedAssetPreview({
  asset,
  required,
  onPick,
  onRemove,
}: {
  asset: UploadedAsset | null
  required: boolean
  onPick: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {asset?.url ? (
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
      <Button type="button" variant="outline" onClick={onPick}>
        <UploadIcon data-icon="inline-start" />
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
