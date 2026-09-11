"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/auth/session"
import { destroyImage } from "@/services/cloudinary/service"
import {
  parseProductForm,
  toFieldErrors,
  toProductInsertValues,
  type ProductFormState,
} from "@/schemas/product-form-data"

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const user = await requireUser()
  const parsed = parseProductForm(formData)
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error) }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .insert({ ...toProductInsertValues(parsed.data), user_id: user.id })
    .select("id")
    .single()

  if (error) {
    return { error: `Failed to create product: ${error.message}` }
  }

  revalidatePath("/products")
  revalidatePath("/dashboard")
  redirect(`/products/${data.id}`)
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireUser()
  const parsed = parseProductForm(formData)
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error) }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .update(toProductInsertValues(parsed.data))
    .eq("id", id)
    .select("id")
    .single()

  if (error) {
    const notFound = error.code === "PGRST116"
    return {
      error: notFound
        ? "Product not found."
        : `Failed to update product: ${error.message}`,
    }
  }

  await destroyReplacedAssets(formData, parsed.data)

  revalidatePath("/products")
  revalidatePath("/dashboard")
  redirect(`/products/${id}`)
}

async function destroyReplacedAssets(
  formData: FormData,
  data: { receipt_public_id?: string; product_asset_public_id?: string }
): Promise<void> {
  const previousReceipt = String(
    formData.get("previous_receipt_public_id") ?? ""
  )
  const previousAsset = String(
    formData.get("previous_product_asset_public_id") ?? ""
  )

  if (previousReceipt && previousReceipt !== data.receipt_public_id) {
    await destroyImage(previousReceipt)
  }
  if (previousAsset && previousAsset !== data.product_asset_public_id) {
    await destroyImage(previousAsset)
  }
}
