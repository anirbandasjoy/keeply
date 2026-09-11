"use client"

import {
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form"
import type { ProductFormInput } from "@/schemas/product"
import { UploadField } from "./upload-field"

type ProductUploadFieldsProps = {
  control: Control<ProductFormInput, unknown>
  errors: FieldErrors<ProductFormInput>
  setValue: UseFormSetValue<ProductFormInput>
}

export function ProductUploadFields({
  control,
  errors,
  setValue,
}: ProductUploadFieldsProps) {
  const receiptUrl = useWatch({ control, name: "receipt_url" })
  const receiptPublicId = useWatch({ control, name: "receipt_public_id" })
  const assetUrl = useWatch({ control, name: "product_asset_url" })
  const assetPublicId = useWatch({ control, name: "product_asset_public_id" })

  return (
    <>
      <UploadField
        label="Receipt"
        kind="receipt"
        required
        description="Upload the purchase receipt (image or PDF)."
        value={
          receiptUrl && receiptPublicId
            ? { url: receiptUrl, publicId: receiptPublicId }
            : null
        }
        onChange={(value) => {
          setValue("receipt_url", value?.url ?? "", { shouldValidate: true })
          setValue("receipt_public_id", value?.publicId ?? "")
        }}
        error={errors.receipt_url?.message}
      />

      <UploadField
        label="Product image (optional)"
        kind="product_asset"
        required={false}
        description="Optional product photo."
        value={
          assetUrl && assetPublicId
            ? { url: assetUrl, publicId: assetPublicId }
            : null
        }
        onChange={(value) => {
          setValue("product_asset_url", value?.url ?? "")
          setValue("product_asset_public_id", value?.publicId ?? "")
        }}
        error={errors.product_asset_url?.message}
      />
    </>
  )
}
