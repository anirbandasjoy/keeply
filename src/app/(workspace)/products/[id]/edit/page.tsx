import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/services/products/queries"
import { ProductFormView } from "@/view/products/product-form-view"

export const metadata: Metadata = {
  title: "Edit product",
}

export default async function EditProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return <ProductFormView product={product} />
}
