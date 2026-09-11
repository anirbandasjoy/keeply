"use client"

import { useState, useTransition } from "react"
import { SendIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { triggerNotifications } from "@/services/admin/actions"

type NotificationResult = {
  sent: number
  skipped: number
  failed: number
}

export function SendNotificationsButton() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<NotificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setResult(null)
    setError(null)
    startTransition(async () => {
      const data = await triggerNotifications()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        render={<span />}
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex w-fit items-center gap-2"
      >
        {isPending ? (
          <Spinner className="size-4" />
        ) : (
          <SendIcon data-icon="inline-start" />
        )}
        {isPending ? "Sending..." : "Send Notifications"}
      </Button>

      {result && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircleIcon className="size-4 text-green-600" />
          Sent {result.sent}, skipped {result.skipped}, failed {result.failed}
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
