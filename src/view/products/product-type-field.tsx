import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProductType } from "@/types/product"

export function ProductTypeField({
  value,
  error,
  onChange,
}: {
  value: ProductType | undefined
  error?: string
  onChange: (value: ProductType) => void
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor="type">Type</FieldLabel>
      <Select value={value ?? ""} onValueChange={(next) => onChange(next as ProductType)}>
        <SelectTrigger id="type" className="w-full" aria-invalid={error ? true : undefined}>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="warranty">Warranty</SelectItem>
            <SelectItem value="guarantee">Guarantee</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
