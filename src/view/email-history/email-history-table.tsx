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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  NotificationStatusBadge,
  ReminderTypeBadge,
} from "./notification-badges"
import { NotificationCard } from "./notification-card"

export function EmailHistoryTable({
  notifications,
}: {
  notifications: EmailNotification[]
}) {
  return (
    <>
      <div className="grid gap-3 md:hidden">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reminder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Sent At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((n) => (
              <TableRow key={n.id}>
                <TableCell>
                  <ReminderTypeBadge type={n.reminder_type} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
                </TableCell>
                <TableCell>
                  <Link
                    href={`/products/${n.product_id}`}
                    className="text-sm hover:underline"
                  >
                    {n.subject}
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {n.sent_at ? formatUtcTimestamp(n.sent_at) : "—"}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
