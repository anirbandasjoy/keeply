"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RotateCcwIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
} from "./filter-options"

export function ProductsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const hasFilters = searchParams.toString().length > 0

  function updateParam(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const query = params.size ? `?${params.toString()}` : ""
    startTransition(() => {
      router.replace(`/products${query}`)
    })
  }

  function resetFilters(): void {
    startTransition(() => {
      router.replace("/products")
    })
  }

  const selects: Array<{
    key: string
    ariaLabel: string
    placeholder: string
    options: Array<{ value: string; label: string }>
  }> = [
    { key: "type", ariaLabel: "Filter by type", placeholder: "All types", options: TYPE_FILTER_OPTIONS },
    {
      key: "status",
      ariaLabel: "Filter by status",
      placeholder: "All statuses",
      options: STATUS_FILTER_OPTIONS,
    },
    { key: "sort", ariaLabel: "Sort products", placeholder: "Sort by", options: SORT_OPTIONS },
  ]

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        updateParam("q", String(data.get("q") ?? "").trim())
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Search by name"
        className="w-44"
        aria-label="Search products by name"
      />
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <SearchIcon data-icon="inline-start" />
        )}
        Search
      </Button>
      {selects.map(({ key, ariaLabel, placeholder, options }) => (
        <Select
          key={key}
          value={searchParams.get(key) ?? (key === "sort" ? "expires_asc" : "")}
          onValueChange={(value) => updateParam(key, value ?? "")}
        >
          <SelectTrigger aria-label={ariaLabel} className="w-36">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ))}
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={resetFilters}
        >
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
      ) : null}
    </form>
  )
}
