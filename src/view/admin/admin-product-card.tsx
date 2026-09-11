import Link from "next/link"
import { formatUtcDate } from "@/lib/date"
import {
  ProductStatusBadge,
  ProductTypeBadge,
} from "@/components/shared/product-badges"
import { RemainingTime } from "@/components/shared/remaining-time"
import type { AdminProduct } from "@/services/admin/queries"

export function AdminProductCard({ product }: { product: AdminProduct }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${product.id}`}
            className="font-medium hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.userEmail}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <ProductTypeBadge type={product.type} />
          <ProductStatusBadge status={product.status} />
        </div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        <p>Expires {formatUtcDate(product.expires_at)}</p>
        <RemainingTime
          expiresAt={product.expires_at}
          status={product.status}
        />
      </div>
    </div>
  )
}
