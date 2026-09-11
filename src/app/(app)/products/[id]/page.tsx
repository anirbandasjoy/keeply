import { notFound } from "next/navigation"
import { getProductById } from "@/services/products/queries"
import { ProductDetailsView } from "@/view/products/product-details-view"

export default async function ProductDetailsPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return <ProductDetailsView product={product} />
}
