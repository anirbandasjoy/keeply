import type { z } from "zod"
import type { ProductInsert } from "@/types/product"
import { productFormSchema, type ProductFormValues } from "./product"

export type ProductFormState = {
  error?: string
  fieldErrors?: Record<string, string>
}

function normalizeFormData(
  formData: FormData
): Record<string, string | undefined> {
  return Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [
      key,
      typeof value === "string" ? value : undefined,
    ])
  )
}

export function parseProductForm(formData: FormData) {
  return productFormSchema.safeParse(normalizeFormData(formData))
}

function clean(value: string | undefined): string | undefined {
  return value === "" ? undefined : value
}

export function toProductInsertValues(
  values: ProductFormValues
): Omit<ProductInsert, "user_id"> {
  return {
    name: values.name,
    type: values.type,
    purchase_date: values.purchase_date,
    duration: values.duration,
    receipt_url: values.receipt_url,
    status: values.status,
    category: clean(values.category),
    notes: clean(values.notes),
    receipt_public_id: clean(values.receipt_public_id),
    product_asset_url: clean(values.product_asset_url),
    product_asset_public_id: clean(values.product_asset_public_id),
    product_purchase_url: clean(values.product_purchase_url),
    claim_url: clean(values.claim_url),
  }
}

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}
