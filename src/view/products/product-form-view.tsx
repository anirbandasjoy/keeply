import type { Product } from "@/types/product"
import { ProductForm } from "./product-form"

export function ProductFormView({ product }: { product: Product | null }) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {product ? `Edit ${product.name}` : "Add product"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {product
            ? "Update the tracker details below."
            : "Track a warranty, guarantee or subscription."}
        </p>
      </div>
      <ProductForm product={product} />
    </main>
  )
}
