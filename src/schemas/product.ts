import { z } from "zod"

const PRODUCT_TYPES = ["warranty", "guarantee", "subscription"] as const
const PRODUCT_STATUSES = ["active", "expired", "cancelled"] as const
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isValidUrl(value: string): boolean {
  return z.url().safeParse(value).success
}

const optionalText = z.string().trim().optional()

const optionalUrl = optionalText.refine(
  (value) => value === undefined || value === "" || isValidUrl(value),
  { message: "Enter a valid URL" }
)

const requiredDate = z
  .string()
  .min(1, { message: "Purchase date is required" })
  .regex(DATE_PATTERN, { message: "Enter a valid date" })

const durationDays = z
  .union([z.number(), z.string()], { message: "Duration is required" })
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .refine((value) => Number.isInteger(value) && value >= 1, {
    message: "Duration must be a whole number of days (minimum 1)",
  })

export const productFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  type: z.enum(PRODUCT_TYPES, { message: "Select a tracker type" }),
  purchase_date: requiredDate,
  duration: durationDays,
  receipt_url: z
    .string()
    .min(1, { message: "A receipt upload is required" })
    .refine(isValidUrl, { message: "Invalid receipt URL" }),
  status: z.enum(PRODUCT_STATUSES).optional(),
  category: optionalText,
  notes: optionalText,
  receipt_public_id: optionalText,
  product_asset_url: optionalUrl,
  product_asset_public_id: optionalText,
  product_purchase_url: optionalUrl,
  claim_url: optionalUrl,
})

export type ProductFormValues = z.output<typeof productFormSchema>
export type ProductFormInput = z.input<typeof productFormSchema>
