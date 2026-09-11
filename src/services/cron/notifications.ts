import type { SupabaseClient } from "@supabase/supabase-js"
import type { ReminderType } from "@/types/email-notification"
import { createServiceClient } from "@/lib/supabase/service"
import { sendReminderEmail } from "@/services/email/send"

type NotificationResult = {
  sent: number
  skipped: number
  failed: number
}

function getDueReminders(expiresAt: string): ReminderType[] {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays <= 0) return ["expired", "3_days_before", "7_days_before"]
  if (diffDays <= 3) return ["3_days_before", "7_days_before"]
  if (diffDays <= 7) return ["7_days_before"]
  return []
}

async function processReminder(
  supabase: SupabaseClient,
  product: { id: string; name: string; expires_at: string; claim_url: string | null; user_id: string },
  email: string,
  reminderType: ReminderType,
  result: NotificationResult
): Promise<void> {
  const { data: existing } = await supabase
    .from("email_notifications")
    .select("id")
    .eq("product_id", product.id)
    .eq("reminder_type", reminderType)
    .maybeSingle()
  if (existing) { result.skipped++; return }

  const sendResult = await sendReminderEmail({
    to: email,
    productName: product.name,
    reminderType,
    expiresAt: product.expires_at,
    claimUrl: product.claim_url ?? undefined,
  })

  await supabase.from("email_notifications").insert({
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
    result.sent++
  } else {
    result.failed++
  }
}

export async function processNotifications(): Promise<NotificationResult> {
  const supabase = createServiceClient()
  const cutoff = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0]

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, expires_at, claim_url, user_id")
    .eq("status", "active")
    .lte("expires_at", cutoff)
  if (error) throw new Error(`Failed to query products: ${error.message}`)

  const userIds = [...new Set((products ?? []).map((p) => p.user_id))]
  const emailMap = new Map<string, string>()
  for (const uid of userIds) {
    const { data: user, error: e } = await supabase.auth.admin.getUserById(uid)
    if (!e && user?.user.email) emailMap.set(uid, user.user.email)
  }

  const result: NotificationResult = { sent: 0, skipped: 0, failed: 0 }
  for (const product of products ?? []) {
    const email = emailMap.get(product.user_id)
    if (!email) { result.skipped++; continue }
    for (const reminderType of getDueReminders(product.expires_at)) {
      await processReminder(supabase, product, email, reminderType, result)
    }
  }
  return result
}
