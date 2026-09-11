import Link from "next/link"
import { AlertTriangleIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatUtcTimestamp } from "@/lib/date"
import type { EmailNotification } from "@/types/email-notification"
import {
  NotificationStatusBadge,
  ReminderTypeBadge,
} from "./notification-badges"

export function NotificationCard({
  notification,
}: {
  notification: EmailNotification
}) {
  const n = notification
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${n.product_id}`}
            className="text-sm font-medium hover:underline"
          >
            {n.subject}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <NotificationStatusBadge status={n.status} />
          {n.status === "failed" && n.error_message ? (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangleIcon className="size-4 text-destructive" />
              </TooltipTrigger>
              <TooltipContent>{n.error_message}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ReminderTypeBadge type={n.reminder_type} />
        <p className="text-xs text-muted-foreground">
          {n.sent_at ? formatUtcTimestamp(n.sent_at) : "Not sent"}
        </p>
      </div>
    </div>
  )
}
