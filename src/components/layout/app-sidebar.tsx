"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  MailIcon,
  PackageIcon,
  ShieldIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut } from "@/services/auth/actions"
import { NavGroup } from "./nav-group"

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Products", href: "/products", icon: PackageIcon },
  { title: "Email History", href: "/email-history", icon: MailIcon },
] as const

const ADMIN_ITEMS = [
  { title: "Admin", href: "/admin", icon: ShieldIcon },
] as const

export function AppSidebar({
  email,
  isAdmin,
}: {
  email: string
  isAdmin: boolean
}) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
                K
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Keeply</span>
                <span className="text-xs text-muted-foreground">
                  Expiry tracker
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Application" items={NAV_ITEMS} pathname={pathname} />
        {isAdmin ? (
          <NavGroup label="Admin" items={ADMIN_ITEMS} pathname={pathname} />
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 px-2 py-1">
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
