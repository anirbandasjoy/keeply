import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Product } from "@/types/product"
import { ProductForm } from "./product-form"

export function ProductFormView({ product }: { product: Product | null }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {product ? `Edit ${product.name}` : "Add product"}
          </CardTitle>
          <CardDescription>
            {product
              ? "Update the tracker details below."
              : "Track a warranty, guarantee or subscription."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
    </main>
  )
}
