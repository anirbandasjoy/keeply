"use client"

import Link from "next/link"
import { LogOutIcon, ShieldIcon, UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/services/auth/actions"

export function UserMenu({
  email,
  isAdmin,
}: {
  email: string
  isAdmin: boolean
}) {
  const initial = email.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground outline-none hover:opacity-80">
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">Account</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldIcon data-icon="inline-start" />
            Admin
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <UserIcon data-icon="inline-start" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut} className="flex w-full items-center gap-1.5">
            <LogOutIcon data-icon="inline-start" />
            <button type="submit" className="text-sm">
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
