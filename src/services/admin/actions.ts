"use server"

import { processNotifications } from "@/services/cron/notifications"
import { requireAdminUser } from "@/lib/auth/admin"

export async function triggerNotifications(): Promise<{
  sent: number
  skipped: number
  failed: number
  error?: string
}> {
  await requireAdminUser()

  try {
    return await processNotifications()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Notifications failed"
    return { sent: 0, skipped: 0, failed: 0, error: message }
  }
}
