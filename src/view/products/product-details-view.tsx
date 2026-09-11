import Image from "next/image"
import Link from "next/link"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DetailRow } from "@/components/shared/detail-row"
import {
  ProductStatusBadge,
  ProductTypeBadge,
} from "@/components/shared/product-badges"
import { RemainingTime } from "@/components/shared/remaining-time"
import { formatUtcDate } from "@/lib/date"
import type { Product } from "@/types/product"
import { DeleteProductButton } from "./delete-product-button"
import { ProductLinks } from "./product-links"

export function ProductDetailsView({ product }: { product: Product }) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <ProductTypeBadge type={product.type} />
            <ProductStatusBadge status={product.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            render={<Link href={`/products/${product.id}/edit`} />}
          >
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
          <DeleteProductButton
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_380px]">
        {product.product_asset_url ? (
          <Card className="overflow-hidden">
            <Image
              src={product.product_asset_url}
              alt={product.name}
              width={800}
              height={450}
              className="h-48 w-full object-cover sm:h-64 md:h-full md:min-h-64"
            />
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              Purchased {formatUtcDate(product.purchase_date)} for{" "}
              {product.duration} day{product.duration === 1 ? "" : "s"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <DetailRow label="Expiration">
              <p className="text-sm font-medium">
                {formatUtcDate(product.expires_at)}
              </p>
              <RemainingTime
                expiresAt={product.expires_at}
                status={product.status}
              />
            </DetailRow>
            <DetailRow label="Category">
              <p className="text-sm">{product.category ?? "—"}</p>
            </DetailRow>
            <DetailRow label="Notes">
              <p className="text-sm whitespace-pre-line">
                {product.notes ?? "—"}
              </p>
            </DetailRow>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductLinks product={product} />
        </CardContent>
      </Card>
    </main>
  )
}
