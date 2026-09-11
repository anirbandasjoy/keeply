import { BottomNav } from "@/components/layout/bottom-nav"
import { TopHeader } from "@/components/layout/top-header"
import { isAdminUser } from "@/lib/auth/admin"
import { requireUser } from "@/lib/auth/session"

export default async function AppLayout({
  children,
}: LayoutProps<"/">) {
  const user = await requireUser()
  const isAdmin = isAdminUser(user)

  return (
    <div className="flex min-h-dvh flex-col">
      <TopHeader email={user.email ?? ""} isAdmin={isAdmin} />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BottomNav isAdmin={isAdmin} />
    </div>
  )
}
