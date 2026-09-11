import Link from "next/link"
import { EyeIcon, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ProductStatusBadge,
  ProductTypeBadge,
} from "@/components/shared/product-badges"
import { RemainingTime } from "@/components/shared/remaining-time"
import { formatUtcDate } from "@/lib/date"
import type { Product } from "@/types/product"
import { DeleteProductButton } from "./delete-product-button"

export function ProductCard({ product }: { product: Product }) {
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
          {product.category ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.category}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href={`/products/${product.id}`} />}
            aria-label={`View ${product.name}`}
          >
            <EyeIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href={`/products/${product.id}/edit`} />}
            aria-label={`Edit ${product.name}`}
          >
            <PencilIcon />
          </Button>
          <DeleteProductButton
            productId={product.id}
            productName={product.name}
            size="icon-sm"
            showLabel={false}
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ProductTypeBadge type={product.type} />
        <ProductStatusBadge status={product.status} />
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
