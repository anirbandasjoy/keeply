import Link from "next/link"
import { formatUtcDate } from "@/lib/date"
import {
  ProductStatusBadge,
  ProductTypeBadge,
} from "@/components/shared/product-badges"
import { RemainingTime } from "@/components/shared/remaining-time"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminProduct } from "@/services/admin/queries"

export function AdminProductsTable({
  products,
}: {
  products: AdminProduct[]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Created</TableHead>
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
                <p className="text-sm text-muted-foreground">
                  {product.userEmail}
                </p>
              </TableCell>
              <TableCell>
                <ProductTypeBadge type={product.type} />
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {formatUtcDate(product.expires_at)}
                </p>
                <RemainingTime
                  expiresAt={product.expires_at}
                  status={product.status}
                />
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {formatUtcDate(product.created_at)}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
