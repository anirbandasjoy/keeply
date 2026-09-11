import Link from "next/link"
import { PackageIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { Product } from "@/types/product"
import { ProductsFilters } from "./products-filters"
import { ProductsTable } from "./products-table"

export function ProductsView({
  products,
  hasFilters,
}: {
  products: Product[]
  hasFilters: boolean
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} tracker{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button render={<Link href="/products/new" />}>
          <PlusIcon data-icon="inline-start" />
          Add product
        </Button>
      </div>

      <div className="mt-6">
        <ProductsFilters />
      </div>

      <div className="mt-4">
        {products.length === 0 ? (
          <ProductsEmpty hasFilters={hasFilters} />
        ) : (
          <ProductsTable products={products} />
        )}
      </div>
    </main>
  )
}

function ProductsEmpty({ hasFilters }: { hasFilters: boolean }) {
  return (
    <Empty className="mt-4 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageIcon />
        </EmptyMedia>
        <EmptyTitle>
          {hasFilters ? "No matching products" : "No products yet"}
        </EmptyTitle>
        <EmptyDescription>
          {hasFilters
            ? "Try adjusting or clearing the filters above."
            : "Add your first warranty, guarantee or subscription tracker."}
        </EmptyDescription>
      </EmptyHeader>
      {hasFilters ? null : (
        <EmptyContent>
          <Button render={<Link href="/products/new" />}>
            <PlusIcon data-icon="inline-start" />
            Add product
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
