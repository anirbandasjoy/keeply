"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/auth/session"
import { destroyImage } from "@/services/cloudinary/service"

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireUser()
  const id = String(formData.get("id") ?? "")
  if (!id) {
    redirect("/products")
  }

  const supabase = await createClient()
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("id, receipt_public_id, product_asset_public_id")
    .eq("id", id)
    .maybeSingle()

  if (fetchError || !product) {
    console.error("Failed to load product for deletion:", fetchError?.message)
    redirect("/products")
  }

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) {
    console.error("Failed to delete product:", error.message)
    redirect("/products")
  }

  if (product.receipt_public_id) {
    await destroyImage(product.receipt_public_id)
  }
  if (product.product_asset_public_id) {
    await destroyImage(product.product_asset_public_id)
  }

  revalidatePath("/products")
  revalidatePath("/dashboard")
  redirect("/products")
}
