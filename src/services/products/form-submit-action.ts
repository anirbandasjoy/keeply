import type { FieldPath, UseFormSetError } from "react-hook-form"
import type { Product } from "@/types/product"
import {
  createProduct,
  updateProduct,
} from "@/services/products/actions"
import type {
  ProductFormInput,
  ProductFormValues,
} from "@/schemas/product"

function toFormData(
  values: ProductFormInput,
  product: Product | null
): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      formData.set(key, String(value))
    }
  }
  if (product) {
    formData.set("previous_receipt_public_id", product.receipt_public_id ?? "")
    formData.set(
      "previous_product_asset_public_id",
      product.product_asset_public_id ?? ""
    )
  }
  return formData
}

function coerceValues(input: ProductFormInput): ProductFormValues {
  return {
    ...input,
    duration:
      typeof input.duration === "string"
        ? Number(input.duration)
        : input.duration,
  } as ProductFormValues
}

export function createOnSubmitHandler(
  setError: UseFormSetError<ProductFormInput>,
  product: Product | null
) {
  return async (values: ProductFormInput): Promise<void> => {
    const coerced = coerceValues(values)
    const formData = toFormData(coerced, product)
    const result = product
      ? await updateProduct(product.id, {}, formData)
      : await createProduct({}, formData)
    if (!result) return
    for (const [name, message] of Object.entries(result.fieldErrors ?? {})) {
      setError(name as FieldPath<ProductFormInput>, { message })
    }
    const allFieldMessages = Object.values(result.fieldErrors ?? {})
      .filter(Boolean)
      .join(". ")
    if (allFieldMessages) {
      setError("root", { message: allFieldMessages })
    }
    if (result.error) {
      setError("root", { message: result.error })
    }
  }
}
