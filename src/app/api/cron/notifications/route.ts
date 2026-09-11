import { NextResponse } from "next/server"
import { processNotifications } from "@/services/cron/notifications"

function verifyCronSecret(request: Request): boolean {
  const header = request.headers.get("authorization")
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return header === `Bearer ${secret}`
}

async function handle(): Promise<NextResponse> {
  try {
    const result = await processNotifications()
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cron job failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return handle()
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return handle()
}
