import { DashboardView } from "@/view/dashboard/dashboard-view"
import { requireUser } from "@/lib/auth/session"
import {
  getDashboardStats,
  getUpcomingExpirations,
} from "@/services/products/stats-queries"

export default async function DashboardPage() {
  await requireUser()
  const [stats, upcoming] = await Promise.all([
    getDashboardStats(),
    getUpcomingExpirations(5),
  ])

  return <DashboardView stats={stats} upcoming={upcoming} />
}
