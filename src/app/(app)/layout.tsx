import { requireUser } from "@/lib/auth/session"

export default async function AppLayout({
  children,
}: LayoutProps<"/">) {
  await requireUser()
  return <div className="flex min-h-screen flex-1 flex-col bg-background">{children}</div>
}
