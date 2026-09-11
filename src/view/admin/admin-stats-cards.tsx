import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AdminStats } from "@/services/admin/queries"

export function AdminStatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    { title: "Total Products", value: stats.totalProducts },
    { title: "Active", value: stats.activeProducts },
    { title: "Expired", value: stats.expiredProducts },
    { title: "Users", value: stats.totalUsers },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
