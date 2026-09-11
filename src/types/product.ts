import type { Database } from "@/lib/supabase/types"

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]
export type ProductType = Database["public"]["Enums"]["product_type"]
export type ProductStatus = Database["public"]["Enums"]["product_status"]
