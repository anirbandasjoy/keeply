import { NextResponse } from "next/server"
import { resend } from "@/services/email/resend"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const to = typeof body.to === "string" ? body.to : ""

  if (!to || !to.includes("@")) {
    return NextResponse.json(
      { error: "Provide a valid email in { \"to\": \"you@example.com\" }" },
      { status: 400 }
    )
  }

  const from = process.env.EMAIL_FROM
  if (!from) {
    return NextResponse.json(
      { error: "Missing EMAIL_FROM environment variable" },
      { status: 500 }
    )
  }

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: "Keeply — test email",
      html: `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; padding: 20px;">
  <h2>Email system works!</h2>
  <p>This is a test email from Keeply. If you received this, Resend is configured correctly.</p>
  <p style="color: #999; font-size: 13px;">Sent by Keeply — your warranty & subscription tracker.</p>
</body>
</html>`,
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, messageId: result.data?.id })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send test email"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
