"use client"

import { useTransition } from "react"
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    const formData = new FormData()
    formData.set("id", productId)
    startTransition(() => {
      deleteProduct(formData)
    })
  }

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
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={handleDelete}
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Trash2Icon data-icon="inline-start" />
            )}
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
