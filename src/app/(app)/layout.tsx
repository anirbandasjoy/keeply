import { AppSidebar } from "@/components/layout/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { isAdminUser } from "@/lib/auth/admin"
import { requireUser } from "@/lib/auth/session"

export default async function AppLayout({
  children,
}: LayoutProps<"/">) {
  const user = await requireUser()

  return (
    <SidebarProvider>
      <AppSidebar email={user.email ?? ""} isAdmin={isAdminUser(user)} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="!h-4" />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
