import { ShieldIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { AdminProduct, AdminStats } from "@/services/admin/queries"
import { AdminFilters } from "./admin-filters"
import { AdminProductsTable } from "./admin-products-table"
import { AdminStatsCards } from "./admin-stats-cards"

export function AdminView({
  products,
  stats,
  hasFilters,
}: {
  products: AdminProduct[]
  stats: AdminStats
  hasFilters: boolean
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage all products across users
        </p>
      </div>

      <div className="mt-6">
        <AdminStatsCards stats={stats} />
      </div>

      <div className="mt-6">
        <AdminFilters />
      </div>

      <div className="mt-4">
        {products.length === 0 ? (
          <Empty className="mt-4 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShieldIcon />
              </EmptyMedia>
              <EmptyTitle>
                {hasFilters ? "No matching products" : "No products yet"}
              </EmptyTitle>
              <EmptyDescription>
                {hasFilters
                  ? "Try adjusting or clearing the filters above."
                  : "Products will appear here once users add them."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <AdminProductsTable products={products} />
        )}
      </div>
    </main>
  )
}
