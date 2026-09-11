"use client"

import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProduct } from "@/services/products/delete-action"

type DeleteProductButtonProps = {
  productId: string
  productName: string
  size?: "default" | "sm" | "icon-sm"
  showLabel?: boolean
}

export function DeleteProductButton({
  productId,
  productName,
  size = "default",
  showLabel = true,
}: DeleteProductButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size={size}
            aria-label={`Delete ${productName}`}
          />
        }
      >
        <Trash2Icon data-icon={showLabel ? "inline-start" : undefined} />
        {showLabel ? "Delete" : null}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {productName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the tracker, its uploaded receipt and
            image references, and its email notification history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={productId} />
            <AlertDialogAction type="submit" variant="destructive">
              Delete
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
