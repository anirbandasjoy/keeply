import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types/product"

export type ProductSort =
  | "expires_asc"
  | "expires_desc"
  | "name_asc"
  | "name_desc"

export type ProductListParams = {
  search?: string
  type?: Product["type"]
  status?: Product["status"]
  sort?: ProductSort
}

export async function listProducts(
  params: ProductListParams
): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase.from("products").select("*")
  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }
  if (params.type) {
    query = query.eq("type", params.type)
  }
  if (params.status) {
    query = query.eq("status", params.status)
  }

  const sort = params.sort ?? "expires_asc"
  const orderColumn =
    sort === "name_asc" || sort === "name_desc" ? "name" : "expires_at"
  const ascending = sort === "expires_asc" || sort === "name_asc"

  const { data, error } = await query.order(orderColumn, { ascending })
  if (error) {
    throw new Error(`Failed to load products: ${error.message}`)
  }
  return data
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load product: ${error.message}`)
  }
  return data
}
