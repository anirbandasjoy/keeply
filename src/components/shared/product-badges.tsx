import { Badge } from "@/components/ui/badge"
import type { ProductStatus, ProductType } from "@/types/product"

const TYPE_LABELS: Record<ProductType, string> = {
  warranty: "Warranty",
  guarantee: "Guarantee",
  subscription: "Subscription",
}

const STATUS_VARIANTS: Record<
  ProductStatus,
  "secondary" | "destructive" | "outline"
> = {
  active: "secondary",
  expired: "destructive",
  cancelled: "outline",
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Active",
  expired: "Expired",
  cancelled: "Cancelled",
}

export function ProductTypeBadge({ type }: { type: ProductType }) {
  return <Badge variant="outline">{TYPE_LABELS[type]}</Badge>
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
  )
}
