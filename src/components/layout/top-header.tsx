"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  MailIcon,
  PackageIcon,
  ShieldIcon,
} from "lucide-react"
import { cn } from "cn"
import { UserMenu } from "./user-menu"

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Products", href: "/products", icon: PackageIcon },
  { title: "Email", href: "/email-history", icon: MailIcon },
] as const

const ADMIN_ITEMS = [
  { title: "Admin", href: "/admin", icon: ShieldIcon },
] as const

export function TopHeader({
  email,
  isAdmin,
}: {
  email: string
  isAdmin: boolean
}) {
  const pathname = usePathname()
  const items = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : [...NAV_ITEMS]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
              K
            </div>
            <span className="text-lg font-semibold tracking-tight">Keeply</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <UserMenu email={email} isAdmin={isAdmin} />
      </div>
    </header>
  )
}
