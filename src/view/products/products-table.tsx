import Link from "next/link"
import { EyeIcon, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ProductStatusBadge,
  ProductTypeBadge,
} from "@/components/shared/product-badges"
import { RemainingTime } from "@/components/shared/remaining-time"
import { formatUtcDate } from "@/lib/date"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Product } from "@/types/product"
import { DeleteProductButton } from "./delete-product-button"

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Link
                  href={`/products/${product.id}`}
                  className="font-medium hover:underline"
                >
                  {product.name}
                </Link>
                {product.category ? (
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                ) : null}
              </TableCell>
              <TableCell>
                <ProductTypeBadge type={product.type} />
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell>
                <p className="text-sm">{formatUtcDate(product.expires_at)}</p>
                <RemainingTime
                  expiresAt={product.expires_at}
                  status={product.status}
                />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
