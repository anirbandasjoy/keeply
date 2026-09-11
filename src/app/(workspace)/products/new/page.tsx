import type { Metadata } from "next"
import { ProductFormView } from "@/view/products/product-form-view"

export const metadata: Metadata = {
  title: "Add product",
}

export default function NewProductPage() {
  return <ProductFormView product={null} />
}
