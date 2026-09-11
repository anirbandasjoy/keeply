import { createClient } from "@/lib/supabase/server"
import type { EmailNotification, NotificationStatus, ReminderType } from "@/types/email-notification"

export type NotificationListParams = {
  status?: NotificationStatus
  reminderType?: ReminderType
  page?: number
}

const PAGE_SIZE = 20

export async function listEmailNotifications(
  params: NotificationListParams
): Promise<{ items: EmailNotification[]; count: number }> {
  const supabase = await createClient()
  const page = params.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("email_notifications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (params.status) {
    query = query.eq("status", params.status)
  }
  if (params.reminderType) {
    query = query.eq("reminder_type", params.reminderType)
  }

  const { data, error, count } = await query
  if (error) {
    throw new Error(`Failed to load notifications: ${error.message}`)
  }
  return { items: data ?? [], count: count ?? 0 }
}
