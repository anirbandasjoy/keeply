import type { ReminderType } from "@/types/email-notification"
import { formatUtcDate } from "@/lib/date"

type TemplateInput = {
  productName: string
  expiresAt: string
  claimUrl?: string
}

type TemplateOutput = {
  subject: string
  html: string
}

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${content}
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="color: #999; font-size: 13px;">Sent by Keeply — your warranty & subscription tracker.</p>
</body>
</html>`
}

function expirySection(expiresAt: string, claimUrl?: string): string {
  const date = formatUtcDate(expiresAt)
  let html = `<p style="font-size: 16px;"><strong>Expiration date:</strong> ${date}</p>`
  if (claimUrl) {
    html += `<p><a href="${claimUrl}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500;">Start Claim →</a></p>`
  }
  return html
}

function sevenDayTemplate(input: TemplateInput): TemplateOutput {
  return {
    subject: `Your ${input.productName} warranty expires in 7 days`,
    html: wrap(`
      <h2 style="margin-bottom: 8px;">Warranty expiring soon</h2>
      <p>Hi there,</p>
      <p>Your <strong>${input.productName}</strong> warranty expires in <strong>7 days</strong>.</p>
      ${expirySection(input.expiresAt, input.claimUrl)}
      <p>If you don't plan to make a claim, no action is needed.</p>
    `),
  }
}

function threeDayTemplate(input: TemplateInput): TemplateOutput {
  return {
    subject: `Your ${input.productName} warranty expires in 3 days`,
    html: wrap(`
      <h2 style="margin-bottom: 8px;">Warranty expiring soon</h2>
      <p>Hi there,</p>
      <p>Your <strong>${input.productName}</strong> warranty expires in <strong>3 days</strong>. This is a final reminder.</p>
      ${expirySection(input.expiresAt, input.claimUrl)}
      <p>If you need to file a claim, now is the time.</p>
    `),
  }
}

function expiredTemplate(input: TemplateInput): TemplateOutput {
  return {
    subject: `Your ${input.productName} warranty has expired`,
    html: wrap(`
      <h2 style="margin-bottom: 8px;">Warranty expired</h2>
      <p>Hi there,</p>
      <p>Your <strong>${input.productName}</strong> warranty has <strong>expired</strong>.</p>
      ${expirySection(input.expiresAt, input.claimUrl)}
      <p>Some manufacturers allow a grace period for claims. If you believe you're still eligible, check the claim link above.</p>
    `),
  }
}

const templates: Record<ReminderType, (input: TemplateInput) => TemplateOutput> = {
  "7_days_before": sevenDayTemplate,
  "3_days_before": threeDayTemplate,
  "expired": expiredTemplate,
}

export function renderEmail(
  reminderType: ReminderType,
  input: TemplateInput
): TemplateOutput {
  return templates[reminderType](input)
}
