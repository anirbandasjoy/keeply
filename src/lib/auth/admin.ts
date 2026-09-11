import type { User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"

export function isAdminUser(user: User): boolean {
  return user.app_metadata?.["role"] === "admin"
}

export async function requireAdminUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (!isAdminUser(user)) redirect("/dashboard")
  return user
}
