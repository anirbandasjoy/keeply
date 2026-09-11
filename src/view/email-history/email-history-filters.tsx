"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

const STATUS_OPTIONS = [
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
]

const REMINDER_OPTIONS = [
  { value: "7_days_before", label: "7 days before" },
  { value: "3_days_before", label: "3 days before" },
  { value: "expired", label: "Expired" },
]

export function EmailHistoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function updateParam(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const query = params.size ? `?${params.toString()}` : ""
    startTransition(() => {
      router.replace(`/email-history${query}`)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pending ? <Spinner className="text-muted-foreground" /> : null}
      <Select
        value={searchParams.get("status") ?? ""}
        onValueChange={(value) => updateParam("status", value ?? "")}
      >
        <SelectTrigger aria-label="Filter by status" className="w-36" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">All statuses</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get("reminder_type") ?? ""}
        onValueChange={(value) => updateParam("reminder_type", value ?? "")}
      >
        <SelectTrigger aria-label="Filter by reminder type" className="w-44" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">All reminders</SelectItem>
            {REMINDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
