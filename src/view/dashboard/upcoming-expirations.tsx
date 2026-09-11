import Link from "next/link"
import { ClockIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ProductTypeBadge } from "@/components/shared/product-badges"
import { RemainingTime } from "@/components/shared/remaining-time"
import { formatUtcDate } from "@/lib/date"
import type { Product } from "@/types/product"

export function UpcomingExpirations({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming expirations</CardTitle>
        <CardDescription>
          Active trackers closest to their expiration date.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {products.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClockIcon />
              </EmptyMedia>
              <EmptyTitle>Nothing expiring soon</EmptyTitle>
              <EmptyDescription>
                Add products to start tracking their expirations.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex items-center justify-between gap-4 rounded-lg px-2 py-2 hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ProductTypeBadge type={product.type} />
                <span className="truncate text-sm font-medium">
                  {product.name}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-sm">{formatUtcDate(product.expires_at)}</span>
                <RemainingTime
                  expiresAt={product.expires_at}
                  status={product.status}
                />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
