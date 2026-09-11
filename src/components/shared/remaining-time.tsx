import { cn } from "cn"
import type { ProductStatus } from "@/types/product"

function daysUntil(expiresAt: string): number {
  const now = new Date()
  const todayMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  )
  const expiryMs = new Date(`${expiresAt}T00:00:00Z`).getTime()
  return Math.round((expiryMs - todayMs) / 86_400_000)
}

export function formatRemainingTime(
  expiresAt: string,
  status: ProductStatus
): string {
  if (status === "cancelled") return "Cancelled"
  const days = daysUntil(expiresAt)
  if (days === 0) return "Expires today"
  if (days === 1) return "Expires tomorrow"
  if (days > 1) return `Expires in ${days} days`
  const ago = -days
  return ago === 1 ? "Expired 1 day ago" : `Expired ${ago} days ago`
}

export function RemainingTime({
  expiresAt,
  status,
  className,
}: {
  expiresAt: string
  status: ProductStatus
  className?: string
}) {
  const expired = status !== "cancelled" && daysUntil(expiresAt) < 0

  return (
    <span
      className={cn(
        "text-xs",
        expired ? "font-medium text-destructive" : "text-muted-foreground",
        className
      )}
    >
      {formatRemainingTime(expiresAt, status)}
    </span>
  )
}
