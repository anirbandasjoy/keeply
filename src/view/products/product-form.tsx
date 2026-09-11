"use client"

import { useRef, useState } from "react"
import { useWatch, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { productFormSchema, type ProductFormInput } from "@/schemas/product"
import type { ScanDocumentResult } from "@/schemas/scan-document"
import type { Product } from "@/types/product"
import { uploadProductFile } from "./upload-request"
import { BasicProductFields } from "./basic-product-fields"
import { getProductFormDefaults } from "./product-form-defaults"
import {
  ProductUploadFields,
  type PendingUploads,
} from "./product-upload-fields"
import { LinkProductFields } from "./link-product-fields"
import { ScanDocumentButton } from "./scan-document-button"
import { createOnSubmitHandler } from "@/services/products/form-submit-action"

export function ProductForm({ product }: { product: Product | null }) {
  const uploadsRef = useRef<PendingUploads>(null)
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProductFormInput, unknown>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getProductFormDefaults(product),
  })

  const { control, register, handleSubmit, setError, setValue } = form
  const errors = form.formState.errors
  const submitting = form.formState.isSubmitting

  const purchaseDate = useWatch({ control, name: "purchase_date" })
  const typeValue = useWatch({ control, name: "type" })
  const statusValue = useWatch({ control, name: "status" })
  const onSubmit = createOnSubmitHandler(setError, product)

  async function handleFormSubmit(values: ProductFormInput): Promise<void> {
    const pending = uploadsRef.current as PendingUploads | null
    if (!pending) {
      await onSubmit(values)
      return
    }

    setUploading(true)

    try {
      if (pending.receiptFile) {
        const result = await uploadProductFile(
          pending.receiptFile,
          "receipt"
        )
        if (!result.ok) {
          setError("root", { message: `Receipt upload failed: ${result.error}` })
          setUploading(false)
          return
        }
        setValue("receipt_url", result.url, { shouldValidate: true })
        setValue("receipt_public_id", result.publicId)
        values.receipt_url = result.url
        values.receipt_public_id = result.publicId
      }

      if (pending.assetFile) {
        const result = await uploadProductFile(
          pending.assetFile,
          "product_asset"
        )
        if (!result.ok) {
          setError("root", {
            message: `Image upload failed: ${result.error}`,
          })
          setUploading(false)
          return
        }
        setValue("product_asset_url", result.url)
        setValue("product_asset_public_id", result.publicId)
        values.product_asset_url = result.url
        values.product_asset_public_id = result.publicId
      }
    } catch {
      setError("root", { message: "Upload failed unexpectedly" })
      setUploading(false)
      return
    }

    setUploading(false)
    await onSubmit(values)
  }

  const isBusy = submitting || uploading

  function handleScanComplete(
    data: ScanDocumentResult,
    receiptUrl: string,
    receiptPublicId: string
  ): void {
    setValue("name", data.name, { shouldValidate: true })
    setValue("type", data.type, { shouldValidate: true })
    setValue("purchase_date", data.purchase_date, { shouldValidate: true })
    setValue("duration", data.duration, { shouldValidate: true })
    if (data.category) setValue("category", data.category)
    if (data.notes) setValue("notes", data.notes)
    if (data.claim_url) setValue("claim_url", data.claim_url)
    setValue("receipt_url", receiptUrl, { shouldValidate: true })
    setValue("receipt_public_id", receiptPublicId)
  }

  function handleSubmitEvent(event: React.FormEvent<HTMLFormElement>): void {
    void handleSubmit(handleFormSubmit)(event)
  }

  return (
    <form
      onSubmit={handleSubmitEvent}
      noValidate
      className="flex flex-col gap-8"
    >
      {!product ? (
        <div className="flex items-center gap-3">
          <ScanDocumentButton
            onScanComplete={handleScanComplete}
            disabled={isBusy}
          />
          <p className="text-sm text-muted-foreground">
            or fill the form manually below
          </p>
        </div>
      ) : null}
      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        <BasicProductFields
          register={register}
          control={control}
          errors={errors}
          isEdit={Boolean(product)}
          purchaseDate={purchaseDate}
          typeValue={typeValue}
          statusValue={statusValue}
          onPurchaseDateChange={(value) =>
            form.setValue("purchase_date", value, { shouldValidate: true })
          }
          onTypeChange={(value) =>
            form.setValue("type", value, { shouldValidate: true })
          }
          onStatusChange={(value) => form.setValue("status", value)}
        />
        <ProductUploadFields
          ref={uploadsRef}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      </div>
      <LinkProductFields register={register} errors={errors} />
      {errors.root?.message ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={isBusy}>
          {isBusy ? <Spinner data-icon="inline-start" /> : null}
          {uploading
            ? "Uploading files..."
            : product
              ? "Save changes"
              : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          render={
            <Link href={product ? `/products/${product.id}` : "/products"} />
          }
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
