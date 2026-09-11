import type { Product } from "@/types/product"

export function getProductFormDefaults(product: Product | null) {
  return {
    name: product?.name ?? "",
    type: product?.type,
    purchase_date: product?.purchase_date ?? "",
    duration: product?.duration ?? "",
    receipt_url: product?.receipt_url ?? "",
    receipt_public_id: product?.receipt_public_id ?? "",
    status: product?.status,
    category: product?.category ?? "",
    notes: product?.notes ?? "",
    product_asset_url: product?.product_asset_url ?? "",
    product_asset_public_id: product?.product_asset_public_id ?? "",
    product_purchase_url: product?.product_purchase_url ?? "",
    claim_url: product?.claim_url ?? "",
  }
}
