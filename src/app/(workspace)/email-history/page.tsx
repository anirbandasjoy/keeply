import { EmailHistoryView } from "@/view/email-history/email-history-view"
import { listEmailNotifications } from "@/services/email-notifications/queries"
import type { NotificationStatus, ReminderType } from "@/types/email-notification"

const STATUSES: NotificationStatus[] = ["sent", "failed", "pending"]
const REMINDER_TYPES: ReminderType[] = [
  "7_days_before",
  "3_days_before",
  "expired",
]

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function pick<T extends string>(
  value: string | undefined,
  allowed: T[]
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined
}

export default async function EmailHistoryPage({
  searchParams,
}: PageProps<"/email-history">) {
  const sp = await searchParams
  const statusParam = firstParam(sp.status)
  const reminderParam = firstParam(sp.reminder_type)

  const { items } = await listEmailNotifications({
    status: pick(statusParam, STATUSES),
    reminderType: pick(reminderParam, REMINDER_TYPES),
  })

  return (
    <EmailHistoryView
      notifications={items}
      hasFilters={Boolean(statusParam || reminderParam)}
    />
  )
}
