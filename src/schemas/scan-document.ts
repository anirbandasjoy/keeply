import { z } from "zod"

const PRODUCT_TYPES = ["warranty", "guarantee", "subscription"] as const

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const scanDocumentSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(PRODUCT_TYPES),
  purchase_date: z.string().regex(DATE_PATTERN),
  duration: z.number().int().positive(),
  category: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  claim_url: z.string().url().optional().nullable(),
})

export type ScanDocumentResult = z.output<typeof scanDocumentSchema>
