import type { User } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signOut } from "@/services/auth/actions"

type DashboardViewProps = {
  user: User
  isAdmin: boolean
}

export function DashboardView({ user, isAdmin }: DashboardViewProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {user.email ?? "unknown user"}
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Keeply is set up
            {isAdmin ? <Badge>admin</Badge> : null}
          </CardTitle>
          <CardDescription>
            Authentication is working. Products, email reminders and admin
            tools will appear here in the next steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Next step: create the database schema for products and email
          notifications.
        </CardContent>
      </Card>
    </main>
  )
}
