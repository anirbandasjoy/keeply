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
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
]

const TYPE_OPTIONS = [
  { value: "warranty", label: "Warranty" },
  { value: "guarantee", label: "Guarantee" },
  { value: "subscription", label: "Subscription" },
]

export function AdminFilters() {
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
      router.replace(`/admin${query}`)
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
        value={searchParams.get("type") ?? ""}
        onValueChange={(value) => updateParam("type", value ?? "")}
      >
        <SelectTrigger aria-label="Filter by type" className="w-36" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">All types</SelectItem>
            {TYPE_OPTIONS.map((option) => (
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
