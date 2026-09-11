import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

export function ProductLinks({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" render={<Link href={product.receipt_url} />}>
        <ExternalLinkIcon data-icon="inline-start" />
        View receipt
      </Button>
      {product.product_purchase_url ? (
        <Button
          variant="outline"
          render={<Link href={product.product_purchase_url} />}
        >
          <ExternalLinkIcon data-icon="inline-start" />
          Purchase link
        </Button>
      ) : null}
      {product.claim_url ? (
        <Button variant="outline" render={<Link href={product.claim_url} />}>
          <ExternalLinkIcon data-icon="inline-start" />
          Claim link
        </Button>
      ) : null}
    </div>
  )
}
