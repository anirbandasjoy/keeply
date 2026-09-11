"use client"

import { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import {
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form"
import type { ProductFormInput } from "@/schemas/product"
import { UploadField } from "./upload-field"

export type PendingUploads = {
  receiptFile: File | null
  assetFile: File | null
}

type ProductUploadFieldsProps = {
  control: Control<ProductFormInput, unknown>
  errors: FieldErrors<ProductFormInput>
  setValue: UseFormSetValue<ProductFormInput>
}

export const ProductUploadFields = forwardRef<
  PendingUploads,
  ProductUploadFieldsProps
>(function ProductUploadFields({ control, errors, setValue }, ref) {
  const receiptFileRef = useRef<File | null>(null)
  const receiptPreviewRef = useRef<string | null>(null)
  const [receiptState, setReceiptState] = useState<{
    file: File | null
    previewUrl: string | null
    fileName: string | null
  }>({ file: null, previewUrl: null, fileName: null })

  const assetFileRef = useRef<File | null>(null)
  const assetPreviewRef = useRef<string | null>(null)
  const [assetState, setAssetState] = useState<{
    file: File | null
    previewUrl: string | null
    fileName: string | null
  }>({ file: null, previewUrl: null, fileName: null })

  useImperativeHandle(ref, () => ({
    get receiptFile() {
      return receiptFileRef.current
    },
    get assetFile() {
      return assetFileRef.current
    },
  }))

  useEffect(() => {
    return () => {
      if (receiptPreviewRef.current) {
        URL.revokeObjectURL(receiptPreviewRef.current)
      }
      if (assetPreviewRef.current) {
        URL.revokeObjectURL(assetPreviewRef.current)
      }
    }
  }, [])

  const handleReceiptSelect = useCallback(
    (file: File, previewUrl: string) => {
      if (receiptPreviewRef.current) {
        URL.revokeObjectURL(receiptPreviewRef.current)
      }
      receiptFileRef.current = file
      receiptPreviewRef.current = previewUrl
      setReceiptState({ file, previewUrl, fileName: file.name })
      setValue("receipt_url", `pending:${file.name}`, { shouldValidate: true })
    },
    [setValue]
  )

  const handleReceiptClear = useCallback(() => {
    if (receiptPreviewRef.current) {
      URL.revokeObjectURL(receiptPreviewRef.current)
      receiptPreviewRef.current = null
    }
    receiptFileRef.current = null
    setReceiptState({ file: null, previewUrl: null, fileName: null })
    setValue("receipt_url", "", { shouldValidate: true })
    setValue("receipt_public_id", "")
  }, [setValue])

  const handleAssetSelect = useCallback(
    (file: File, previewUrl: string) => {
      if (assetPreviewRef.current) {
        URL.revokeObjectURL(assetPreviewRef.current)
      }
      assetFileRef.current = file
      assetPreviewRef.current = previewUrl
      setAssetState({ file, previewUrl, fileName: file.name })
    },
    []
  )

  const handleAssetClear = useCallback(() => {
    if (assetPreviewRef.current) {
      URL.revokeObjectURL(assetPreviewRef.current)
      assetPreviewRef.current = null
    }
    assetFileRef.current = null
    setAssetState({ file: null, previewUrl: null, fileName: null })
    setValue("product_asset_url", "")
    setValue("product_asset_public_id", "")
  }, [setValue])

  const receiptUrl = useWatch({ control, name: "receipt_url" })
  const receiptPublicId = useWatch({ control, name: "receipt_public_id" })
  const assetUrl = useWatch({ control, name: "product_asset_url" })
  const assetPublicId = useWatch({ control, name: "product_asset_public_id" })

  const hasExistingReceipt = Boolean(receiptUrl && receiptPublicId)
  const hasExistingAsset = Boolean(assetUrl && assetPublicId)

  return (
    <div className="flex flex-col gap-5">
      <UploadField
        label="Receipt"
        kind="receipt"
        required
        description="Upload the purchase receipt (image)."
        value={
          hasExistingReceipt && !receiptState.file
            ? { url: receiptUrl ?? "", publicId: receiptPublicId ?? "" }
            : null
        }
        previewUrl={receiptState.previewUrl}
        fileName={receiptState.fileName}
        error={errors.receipt_url?.message}
        onFileSelect={handleReceiptSelect}
        onClear={handleReceiptClear}
      />

      <UploadField
        label="Product image (optional)"
        kind="product_asset"
        required={false}
        description="Optional product photo."
        value={
          hasExistingAsset && !assetState.file
            ? { url: assetUrl ?? "", publicId: assetPublicId ?? "" }
            : null
        }
        previewUrl={assetState.previewUrl}
        fileName={assetState.fileName}
        error={errors.product_asset_url?.message}
        onFileSelect={handleAssetSelect}
        onClear={handleAssetClear}
      />
    </div>
  )
})
