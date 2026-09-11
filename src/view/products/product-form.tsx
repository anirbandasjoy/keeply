"use client"

import { useWatch, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { productFormSchema, type ProductFormInput } from "@/schemas/product"
import { createOnSubmitHandler } from "@/services/products/form-submit-action"
import type { Product } from "@/types/product"
import { BasicProductFields } from "./basic-product-fields"
import { getProductFormDefaults } from "./product-form-defaults"
import { ProductUploadFields } from "./product-upload-fields"
import { LinkProductFields } from "./link-product-fields"

export function ProductForm({ product }: { product: Product | null }) {
  const form = useForm<ProductFormInput, unknown>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getProductFormDefaults(product),
  })

  const { control, register, handleSubmit, setError } = form
  const errors = form.formState.errors
  const submitting = form.formState.isSubmitting

  const purchaseDate = useWatch({ control, name: "purchase_date" })
  const typeValue = useWatch({ control, name: "type" })
  const statusValue = useWatch({ control, name: "status" })
  const onSubmit = createOnSubmitHandler(setError, product)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8"
    >
      <BasicProductFields
        register={register}
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
        control={control}
        errors={errors}
        setValue={form.setValue}
      />
      <LinkProductFields register={register} errors={errors} />
      {errors.root?.message ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? <Spinner data-icon="inline-start" /> : null}
          {product ? "Save changes" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
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
