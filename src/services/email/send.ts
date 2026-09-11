import type { ReminderType } from "@/types/email-notification"
import { resend } from "./resend"
import { renderEmail } from "./templates"

type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string }

export async function sendReminderEmail(params: {
  to: string
  productName: string
  reminderType: ReminderType
  expiresAt: string
  claimUrl?: string
}): Promise<SendResult> {
  const { subject, html } = renderEmail(params.reminderType, {
    productName: params.productName,
    expiresAt: params.expiresAt,
    claimUrl: params.claimUrl,
  })

  const from = process.env.EMAIL_FROM
  if (!from) {
    return { ok: false, error: "Missing EMAIL_FROM environment variable" }
  }

  try {
    const result = await resend.emails.send({
      from,
      to: params.to,
      subject,
      html,
    })

    if (result.error) {
      return { ok: false, error: result.error.message }
    }

    return { ok: true, messageId: result.data?.id ?? "" }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Email send failed"
    return { ok: false, error: message }
  }
}
