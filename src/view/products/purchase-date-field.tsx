"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatUtcDate } from "@/lib/date"
import { cn } from "cn"

type PurchaseDateFieldProps = {
  value: string | undefined
  error?: string
  onChange: (value: string) => void
}

function toUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const today = new Date()
today.setUTCHours(0, 0, 0, 0)

export function PurchaseDateField({
  value,
  error,
  onChange,
}: PurchaseDateFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(`${value}T00:00:00Z`) : undefined

  return (
    <Field data-invalid={error ? true : undefined} className="flex-1">
      <FieldLabel htmlFor="purchase_date">Purchase date</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id="purchase_date"
              type="button"
              variant="outline"
              aria-invalid={error ? true : undefined}
              className={cn(
                "w-full justify-start font-normal",
                !value && "text-muted-foreground"
              )}
            />
          }
        >
          <CalendarIcon data-icon="inline-start" />
          {value ? formatUtcDate(value) : "Pick a date"}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(toUtcDateString(date))
              }
              setOpen(false)
            }}
            defaultMonth={selected}
            disabled={(date) => date > today}
          />
        </PopoverContent>
      </Popover>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
