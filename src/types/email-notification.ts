import type { Database } from "@/lib/supabase/types"

export type EmailNotification =
  Database["public"]["Tables"]["email_notifications"]["Row"]
export type EmailNotificationInsert =
  Database["public"]["Tables"]["email_notifications"]["Insert"]
export type ReminderType = Database["public"]["Enums"]["reminder_type"]
export type NotificationStatus =
  Database["public"]["Enums"]["notification_status"]
