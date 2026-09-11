"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
} from "./filter-options"

export function ProductsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const query = params.size ? `?${params.toString()}` : ""
    router.replace(`/products${query}`)
  }

  const selects: Array<{
    key: string
    ariaLabel: string
    options: Array<{ value: string; label: string }>
  }> = [
    { key: "type", ariaLabel: "Filter by type", options: TYPE_FILTER_OPTIONS },
    {
      key: "status",
      
      ariaLabel: "Filter by status",
      options: STATUS_FILTER_OPTIONS,
    },
    { key: "sort", ariaLabel: "Sort products", options: SORT_OPTIONS },
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
      <Button type="submit" variant="outline">
        <SearchIcon data-icon="inline-start" />
        Search
      </Button>
      {selects.map(({ key, ariaLabel, options }) => (
        <Select
          key={key}
          value={searchParams.get(key) ?? (key === "sort" ? "expires_asc" : "")}
          onValueChange={(value) => updateParam(key, value ?? "")}
        >
          <SelectTrigger aria-label={ariaLabel} className="w-36" />
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
    </form>
  )
}
