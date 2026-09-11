import { ProductsView } from "@/view/products/products-view"
import {
  listProducts,
  type ProductSort,
} from "@/services/products/queries"
import type { ProductStatus, ProductType } from "@/types/product"

const TYPES: ProductType[] = ["warranty", "guarantee", "subscription"]
const STATUSES: ProductStatus[] = ["active", "expired", "cancelled"]
const SORTS: ProductSort[] = [
  "expires_asc",
  "expires_desc",
  "name_asc",
  "name_desc",
]

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function pick<T extends string>(
  value: string | undefined,
  allowed: T[]
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const sp = await searchParams
  const q = firstParam(sp.q)
  const typeParam = firstParam(sp.type)
  const statusParam = firstParam(sp.status)
  const sortParam = firstParam(sp.sort)

  const products = await listProducts({
    search: q?.trim() || undefined,
    type: pick(typeParam, TYPES),
    status: pick(statusParam, STATUSES),
    sort: pick(sortParam, SORTS),
  })

  return (
    <ProductsView
      products={products}
      hasFilters={Boolean(q || typeParam || statusParam)}
    />
  )
}
