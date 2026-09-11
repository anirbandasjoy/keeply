import { Badge } from "@/components/ui/badge"
import type { NotificationStatus, ReminderType } from "@/types/email-notification"

const REMINDER_LABELS: Record<ReminderType, string> = {
  "7_days_before": "7 days before",
  "3_days_before": "3 days before",
  "expired": "Expired",
}

const STATUS_VARIANTS: Record<
  NotificationStatus,
  "secondary" | "destructive" | "outline"
> = {
  sent: "secondary",
  failed: "destructive",
  pending: "outline",
}

const STATUS_LABELS: Record<NotificationStatus, string> = {
  sent: "Sent",
  failed: "Failed",
  pending: "Pending",
}

export function ReminderTypeBadge({ type }: { type: ReminderType }) {
  return <Badge variant="outline">{REMINDER_LABELS[type]}</Badge>
}

export function NotificationStatusBadge({
  status,
}: {
  status: NotificationStatus
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
  )
}
