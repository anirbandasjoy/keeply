import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ProductFormInput } from "@/schemas/product"
import type { ProductStatus, ProductType } from "@/types/product"
import { FieldErr, invalid } from "./field-error"
import { ProductStatusField } from "./product-status-field"
import { ProductTypeField } from "./product-type-field"
import { PurchaseDateField } from "./purchase-date-field"

type BasicProductFieldsProps = {
  register: UseFormRegister<ProductFormInput>
  errors: FieldErrors<ProductFormInput>
  isEdit: boolean
  purchaseDate: string | undefined
  typeValue: ProductType | undefined
  statusValue: ProductStatus | undefined
  onPurchaseDateChange: (value: string) => void
  onTypeChange: (value: ProductType) => void
  onStatusChange: (value: ProductStatus) => void
}

export function BasicProductFields({
  register,
  errors,
  isEdit,
  purchaseDate,
  typeValue,
  statusValue,
  onPurchaseDateChange,
  onTypeChange,
  onStatusChange,
}: BasicProductFieldsProps) {
  return (
    <FieldGroup>
      <Field data-invalid={invalid(errors.name?.message ? true : undefined)}>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          id="name"
          placeholder="MacBook Pro"
          aria-invalid={errors.name ? true : undefined}
          {...register("name")}
        />
        <FieldErr message={errors.name?.message} />
      </Field>
      <Field>
        <FieldLabel htmlFor="category">Category (optional)</FieldLabel>
        <Input
          id="category"
          placeholder="Electronics"
          aria-invalid={errors.category ? true : undefined}
          {...register("category")}
        />
        <FieldErr message={errors.category?.message} />
      </Field>
      <ProductTypeField
        value={typeValue}
        error={errors.type?.message}
        onChange={onTypeChange}
      />
      <div className="flex flex-col gap-5 sm:flex-row">
        <PurchaseDateField
          value={purchaseDate}
          error={errors.purchase_date?.message}
          onChange={onPurchaseDateChange}
        />
        <Field
          data-invalid={invalid(errors.duration ? true : undefined)}
          className="flex-1"
        >
          <FieldLabel htmlFor="duration">Duration (days)</FieldLabel>
          <Input
            id="duration"
            type="number"
            min={1}
            step={1}
            placeholder="365"
            aria-invalid={errors.duration ? true : undefined}
            {...register("duration", { valueAsNumber: true })}
          />
          <FieldDescription>
            Expiration is calculated automatically.
          </FieldDescription>
          <FieldErr message={errors.duration?.message} />
        </Field>
      </div>
      {isEdit ? (
        <ProductStatusField value={statusValue} onChange={onStatusChange} />
      ) : null}
    </FieldGroup>
  )
}
