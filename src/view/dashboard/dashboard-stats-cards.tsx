import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardStats } from "@/services/products/stats-queries"

const ITEMS: Array<{
  key: keyof DashboardStats
  label: string
}> = [
  { key: "total", label: "Total products" },
  { key: "active", label: "Active" },
  { key: "expiringSoon", label: "Expiring soon" },
  { key: "expired", label: "Expired" },
]

export function DashboardStatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((item) => (
        <Card key={item.key} size="sm">
          <CardHeader>
            <CardTitle className="text-2xl">{stats[item.key]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
