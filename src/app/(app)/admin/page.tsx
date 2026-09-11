import { AdminView } from "@/view/admin/admin-view"
import { requireAdminUser } from "@/lib/auth/admin"
import {
  getAdminStats,
  listAdminProducts,
} from "@/services/admin/queries"
import type { ProductStatus, ProductType } from "@/types/product"

const STATUSES: ProductStatus[] = ["active", "expired", "cancelled"]
const TYPES: ProductType[] = ["warranty", "guarantee", "subscription"]

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function pick<T extends string>(
  value: string | undefined,
  allowed: T[]
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined
}

export default async function AdminPage({
  searchParams,
}: PageProps<"/admin">) {
  await requireAdminUser()

  const sp = await searchParams
  const statusParam = firstParam(sp.status)
  const typeParam = firstParam(sp.type)

  const [stats, { items }] = await Promise.all([
    getAdminStats(),
    listAdminProducts({
      status: pick(statusParam, STATUSES),
      type: pick(typeParam, TYPES),
    }),
  ])

  return (
    <AdminView
      products={items}
      stats={stats}
      hasFilters={Boolean(statusParam || typeParam)}
    />
  )
}
