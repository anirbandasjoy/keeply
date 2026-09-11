import { DashboardView } from "@/view/dashboard/dashboard-view";
import { requireUser } from "@/lib/auth/session";
import { isAdminUser } from "@/lib/auth/admin";

export default async function DashboardPage() {
  const user = await requireUser();
  return <DashboardView user={user} isAdmin={isAdminUser(user)} />;
}
