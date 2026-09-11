import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductStatusBadge } from "@/components/shared/product-badges"
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
import { ProductCard } from "./product-card"
import { DeleteProductButton } from "./delete-product-button"
import { EyeIcon, PencilIcon } from "lucide-react"

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <>
      <div className="grid gap-3 md:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
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
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={<Link href={`/products/${product.id}/edit`} />}
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
    </>
  )
}
