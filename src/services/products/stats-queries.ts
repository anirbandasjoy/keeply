import { createClient } from "@/lib/supabase/server"
import { toUtcDateString } from "@/lib/date"
import type { Product } from "@/types/product"

export type DashboardStats = {
  total: number
  active: number
  expiringSoon: number
  expired: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const today = toUtcDateString(new Date())
  const inSevenDays = toUtcDateString(new Date(Date.now() + 7 * 86_400_000))

  const [total, active, expiringSoon, expired] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gte("expires_at", today)
      .lte("expires_at", inSevenDays),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .neq("status", "cancelled")
      .lt("expires_at", today),
  ])

  for (const result of [total, active, expiringSoon, expired]) {
    if (result.error) {
      throw new Error(`Failed to load stats: ${result.error.message}`)
    }
  }

  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    expiringSoon: expiringSoon.count ?? 0,
    expired: expired.count ?? 0,
  }
}

export async function getUpcomingExpirations(limit = 5): Promise<Product[]> {
  const supabase = await createClient()
  const today = toUtcDateString(new Date())

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .gte("expires_at", today)
    .order("expires_at", { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to load upcoming expirations: ${error.message}`)
  }
  return data
}
