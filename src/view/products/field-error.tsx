import { FieldError } from "@/components/ui/field"

export function FieldErr({ message }: { message?: string }) {
  return message ? <FieldError>{message}</FieldError> : null
}

export function invalid(hasError: boolean | undefined): true | undefined {
  return hasError ? true : undefined
}
