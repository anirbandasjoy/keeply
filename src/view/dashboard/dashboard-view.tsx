import type { DashboardStats } from "@/services/products/stats-queries"
import type { Product } from "@/types/product"
import { DashboardStatsCards } from "./dashboard-stats-cards"
import { UpcomingExpirations } from "./upcoming-expirations"

export function DashboardView({
  stats,
  upcoming,
}: {
  stats: DashboardStats
  upcoming: Product[]
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your warranties, guarantees and subscriptions.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        <DashboardStatsCards stats={stats} />
        <UpcomingExpirations products={upcoming} />
      </div>
    </main>
  )
}
