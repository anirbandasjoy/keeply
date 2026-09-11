import { MailIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { EmailNotification } from "@/types/email-notification"
import { EmailHistoryFilters } from "./email-history-filters"
import { EmailHistoryTable } from "./email-history-table"

export function EmailHistoryView({
  notifications,
  hasFilters,
}: {
  notifications: EmailNotification[]
  hasFilters: boolean
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Email History
        </h1>
        <p className="text-sm text-muted-foreground">
          {notifications.length} notification
          {notifications.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6">
        <EmailHistoryFilters />
      </div>

      <div className="mt-4">
        {notifications.length === 0 ? (
          <Empty className="mt-4 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MailIcon />
              </EmptyMedia>
              <EmptyTitle>
                {hasFilters
                  ? "No matching notifications"
                  : "No notifications yet"}
              </EmptyTitle>
              <EmptyDescription>
                {hasFilters
                  ? "Try adjusting or clearing the filters above."
                  : "Notifications will appear here once reminders are sent."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <EmailHistoryTable notifications={notifications} />
        )}
      </div>
    </main>
  )
}
