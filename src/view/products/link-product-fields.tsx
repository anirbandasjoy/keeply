import type { FieldErrors, UseFormRegister } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProductFormInput } from "@/schemas/product"
import { FieldErr } from "./field-error"

type LinkProductFieldsProps = {
  register: UseFormRegister<ProductFormInput>
  errors: FieldErrors<ProductFormInput>
}

export function LinkProductFields({
  register,
  errors,
}: LinkProductFieldsProps) {
  return (
    <FieldGroup>
      <Field data-invalid={errors.product_purchase_url ? true : undefined}>
        <FieldLabel htmlFor="product_purchase_url">
          Purchase link (optional)
        </FieldLabel>
        <Input
          id="product_purchase_url"
          type="url"
          placeholder="https://store.example.com/product"
          aria-invalid={errors.product_purchase_url ? true : undefined}
          {...register("product_purchase_url")}
        />
        <FieldErr message={errors.product_purchase_url?.message} />
      </Field>

      <Field data-invalid={errors.claim_url ? true : undefined}>
        <FieldLabel htmlFor="claim_url">Claim link (optional)</FieldLabel>
        <Input
          id="claim_url"
          type="url"
          placeholder="https://manufacturer.example.com/warranty"
          aria-invalid={errors.claim_url ? true : undefined}
          {...register("claim_url")}
        />
        <FieldDescription>
          Where you start a warranty or guarantee claim.
        </FieldDescription>
        <FieldErr message={errors.claim_url?.message} />
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Serial number, store, anything worth remembering"
          {...register("notes")}
        />
      </Field>
    </FieldGroup>
  )
}
