import type { ProductStatus, ProductType } from "./enums"

export type ProductsTable = {
  Row: {
    id: string
    user_id: string
    name: string
    category: string | null
    notes: string | null
    product_purchase_url: string | null
    product_asset_url: string | null
    product_asset_public_id: string | null
    receipt_url: string
    receipt_public_id: string | null
    claim_url: string | null
    purchase_date: string
    duration: number
    expires_at: string
    type: ProductType
    status: ProductStatus
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    name: string
    category?: string | null
    notes?: string | null
    product_purchase_url?: string | null
    product_asset_url?: string | null
    product_asset_public_id?: string | null
    receipt_url: string
    receipt_public_id?: string | null
    claim_url?: string | null
    purchase_date: string
    duration: number
    type: ProductType
    status?: ProductStatus
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    name?: string
    category?: string | null
    notes?: string | null
    product_purchase_url?: string | null
    product_asset_url?: string | null
    product_asset_public_id?: string | null
    receipt_url?: string
    receipt_public_id?: string | null
    claim_url?: string | null
    purchase_date?: string
    duration?: number
    type?: ProductType
    status?: ProductStatus
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "products_user_id_fkey"
      columns: ["user_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },
  ]
}
