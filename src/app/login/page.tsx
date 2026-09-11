import type { Metadata } from "next"
import { LoginView } from "@/view/login/login-view"

export const metadata: Metadata = {
  title: "Sign in",
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { error } = await searchParams
  return <LoginView authFailed={error === "auth"} />
}
