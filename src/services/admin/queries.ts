import type { ProductStatus, ProductType } from "@/types/product"
import { createServiceClient } from "@/lib/supabase/service"

export type AdminProductListParams = {
  status?: ProductStatus
  type?: ProductType
  page?: number
}

const PAGE_SIZE = 20

export type AdminProduct = {
  id: string
  name: string
  type: ProductType
  status: ProductStatus
  expires_at: string
  created_at: string
  user_id: string
  userEmail: string
}

export type AdminStats = {
  totalProducts: number
  activeProducts: number
  expiredProducts: number
  totalUsers: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createServiceClient()

  const [productsResult, usersResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, status, user_id", { count: "exact" }),
    supabase.auth.admin.listUsers(),
  ])

  const products = productsResult.data ?? []

  return {
    totalProducts: productsResult.count ?? 0,
    activeProducts: products.filter((p) => p.status === "active").length,
    expiredProducts: products.filter((p) => p.status === "expired").length,
    totalUsers: usersResult.data?.users?.length ?? 0,
  }
}

export async function listAdminProducts(
  params: AdminProductListParams
): Promise<{ items: AdminProduct[]; count: number }> {
  const supabase = createServiceClient()
  const page = params.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (params.status) {
    query = query.eq("status", params.status)
  }
  if (params.type) {
    query = query.eq("type", params.type)
  }

  const { data: products, error, count } = await query
  if (error) {
    throw new Error(`Failed to load products: ${error.message}`)
  }

  const userIds = [...new Set((products ?? []).map((p) => p.user_id))]
  const emailMap = new Map<string, string>()

  for (const uid of userIds) {
    const { data: userResult } = await supabase.auth.admin.getUserById(uid)
    const email = userResult?.user?.email
    if (email) {
      emailMap.set(uid, email)
    }
  }

  const items: AdminProduct[] = (products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    status: p.status,
    expires_at: p.expires_at,
    created_at: p.created_at,
    user_id: p.user_id,
    userEmail: emailMap.get(p.user_id) ?? p.user_id,
  }))

  return { items, count: count ?? 0 }
}
