"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { requireUser } from "@/lib/auth/session"
import { destroyImage } from "@/services/cloudinary/service"
import { sendReminderEmail } from "@/services/email/send"
import {
  parseProductForm,
  toFieldErrors,
  toProductInsertValues,
  type ProductFormState,
} from "@/schemas/product-form-data"
import type { ReminderType } from "@/types/email-notification"

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

export async function sendTestNotification(
  productId: string,
  reminderType: ReminderType
): Promise<{ ok: boolean; reminderType?: ReminderType; error?: string }> {
  const user = await requireUser()
  const supabase = await createClient()
  const serviceSupabase = createServiceClient()

  const { data: product, error: fetchErr } = await supabase
    .from("products")
    .select("id, name, expires_at, claim_url, user_id")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single()

  if (fetchErr || !product) {
    return { ok: false, error: "Product not found" }
  }

  const { data: userData } = await serviceSupabase.auth.admin.getUserById(
    product.user_id
  )
  const email = userData?.user?.email
  if (!email) {
    return { ok: false, error: "No email found for user" }
  }

  const sendResult = await sendReminderEmail({
    to: email,
    productName: product.name,
    reminderType,
    expiresAt: product.expires_at,
    productId: product.id,
    claimUrl: product.claim_url ?? undefined,
  })

  await serviceSupabase.from("email_notifications").insert({
    user_id: product.user_id,
    product_id: product.id,
    reminder_type: reminderType,
    subject: `${product.name} — ${reminderType.replace(/_/g, " ")}`,
    status: sendResult.ok ? "sent" : "failed",
    provider_message_id: sendResult.ok ? sendResult.messageId : null,
    sent_at: sendResult.ok ? new Date().toISOString() : null,
    error_message: sendResult.ok ? null : sendResult.error,
  })

  if (sendResult.ok) {
    return { ok: true, reminderType }
  }
  return { ok: false, error: sendResult.error }
}
