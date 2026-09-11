"use client"

import { useState, useTransition } from "react"
import { MailIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { sendTestNotification } from "@/services/products/actions"
import type { ReminderType } from "@/types/email-notification"

const REMINDER_OPTIONS: Array<{ type: ReminderType; label: string }> = [
  { type: "7_days_before", label: "7 days before" },
  { type: "3_days_before", label: "3 days before" },
  { type: "expired", label: "Expired" },
]

export function SendTestNotificationButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ type: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSelect(reminderType: ReminderType) {
    setResult(null)
    setError(null)
    startTransition(async () => {
      const data = await sendTestNotification(productId, reminderType)
      if (data.ok && data.reminderType) {
        setResult({ type: data.reminderType.replace(/_/g, " ") })
      } else {
        setError(data.error ?? "Failed")
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              disabled={isPending}
              className="inline-flex items-center gap-2"
            />
          }
        >
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <MailIcon data-icon="inline-start" />
          )}
          {isPending ? "Sending..." : "Send Test Notification"}
          {!isPending && <ChevronDownIcon data-icon="inline-end" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {REMINDER_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.type}
              onClick={() => handleSelect(option.type)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {result && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircleIcon className="size-4 text-green-600" />
          Sent: {result.type}
        </p>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <XCircleIcon className="size-4" />
          {error}
        </p>
      )}
    </div>
  )
}
