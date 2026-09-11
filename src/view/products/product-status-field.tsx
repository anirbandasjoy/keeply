import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProductStatus } from "@/types/product"

export function ProductStatusField({
  value,
  onChange,
}: {
  value: ProductStatus | undefined
  onChange: (value: ProductStatus) => void
}) {
  const statusOptions: ProductStatus[] =
    value === "expired"
      ? ["active", "expired", "cancelled"]
      : ["active", "cancelled"]

  return (
    <Field>
      <FieldLabel htmlFor="status">Status</FieldLabel>
      <Select value={value ?? "active"} onValueChange={(next) => onChange(next as ProductStatus)}>
        <SelectTrigger id="status" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
