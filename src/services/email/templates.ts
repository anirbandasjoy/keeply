import type { ReminderType } from "@/types/email-notification"
import { formatUtcDate } from "@/lib/date"

type TemplateInput = {
  productName: string
  expiresAt: string
  productId: string
  claimUrl?: string
}

type TemplateOutput = {
  subject: string
  html: string
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const COLORS = {
  amber: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", btn: "#d97706" },
  orange: { bg: "#fff7ed", border: "#ea580c", text: "#9a3412", btn: "#ea580c" },
  red: { bg: "#fef2f2", border: "#dc2626", text: "#991b1b", btn: "#dc2626" },
} as const

const TYPE_CONFIG: Record<
  ReminderType,
  { color: (typeof COLORS)[keyof typeof COLORS]; label: string; headline: string }
> = {
  "7_days_before": {
    color: COLORS.amber,
    label: "Expiring in 7 days",
    headline: "Warranty Expiring Soon",
  },
  "3_days_before": {
    color: COLORS.orange,
    label: "Expiring in 3 days",
    headline: "Final Notice — Warranty Expiring",
  },
  expired: {
    color: COLORS.red,
    label: "Expired",
    headline: "Warranty Has Expired",
  },
}

function wrap(headerColor: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <tr>
            <td style="background-color:${headerColor};padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.85);">Keeply</p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 0;">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:24px 0 0;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Sent by <strong style="color:#64748b;">Keeply</strong> — your warranty &amp; subscription tracker.</p>
                    <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;text-align:center;">
                      <a href="${BASE_URL}/dashboard" style="color:#64748b;text-decoration:underline;">Manage preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function productCard(
  productName: string,
  expiresAt: string,
  statusLabel: string,
  borderColor: string
): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${borderColor};border-radius:8px;overflow:hidden;margin:24px 0;">
  <tr>
    <td style="padding:20px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:12px;">
            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#94a3b8;">Product</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:600;color:#1e293b;">${productName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:12px;">
            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#94a3b8;">Expiration Date</p>
            <p style="margin:4px 0 0;font-size:15px;color:#334155;">${formatUtcDate(expiresAt)}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#94a3b8;">Status</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:500;color:${borderColor};">${statusLabel}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

function buttonsSection(productId: string, claimUrl?: string): string {
  const productUrl = `${BASE_URL}/products/${productId}`
  let html = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td>
      <a href="${productUrl}" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">View Product →</a>
    </td>`

  if (claimUrl) {
    html += `
    <td style="padding-left:12px;">
      <a href="${claimUrl}" style="display:inline-block;background-color:#ffffff;color:#2563eb;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;border:1px solid #e2e8f0;">Start Claim →</a>
    </td>`
  }

  html += `
  </tr>
</table>`
  return html
}

function sevenDayTemplate(input: TemplateInput): TemplateOutput {
  const config = TYPE_CONFIG["7_days_before"]
  return {
    subject: `Your ${input.productName} warranty expires in 7 days`,
    html: wrap(
      config.color.bg,
      `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">${config.headline}</h1>
      <p style="margin:0 0 4px;font-size:14px;font-weight:500;color:${config.color.border};">${config.label}</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#475569;">Hi there,</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#475569;">Your <strong>${input.productName}</strong> warranty expires in <strong>7 days</strong>. Here are the details:</p>
      ${productCard(input.productName, input.expiresAt, "Active", config.color.border)}
      ${buttonsSection(input.productId, input.claimUrl)}
      <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#64748b;">If you don't plan to make a claim, no action is needed. You won't receive another reminder unless the expiry date changes.</p>
      `
    ),
  }
}

function threeDayTemplate(input: TemplateInput): TemplateOutput {
  const config = TYPE_CONFIG["3_days_before"]
  return {
    subject: `Final notice: ${input.productName} warranty expires in 3 days`,
    html: wrap(
      config.color.bg,
      `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">${config.headline}</h1>
      <p style="margin:0 0 4px;font-size:14px;font-weight:500;color:${config.color.border};">${config.label}</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#475569;">Hi there,</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#475569;">This is a final reminder. Your <strong>${input.productName}</strong> warranty expires in <strong>3 days</strong>.</p>
      ${productCard(input.productName, input.expiresAt, "Expiring soon", config.color.border)}
      ${buttonsSection(input.productId, input.claimUrl)}
      <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#64748b;">If you need to file a claim, now is the time. After expiration, claim eligibility may be limited.</p>
      `
    ),
  }
}

function expiredTemplate(input: TemplateInput): TemplateOutput {
  const config = TYPE_CONFIG.expired
  return {
    subject: `Your ${input.productName} warranty has expired`,
    html: wrap(
      config.color.bg,
      `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">${config.headline}</h1>
      <p style="margin:0 0 4px;font-size:14px;font-weight:500;color:${config.color.border};">${config.label}</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#475569;">Hi there,</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#475569;">Your <strong>${input.productName}</strong> warranty has <strong style="color:${config.color.border};">expired</strong>.</p>
      ${productCard(input.productName, input.expiresAt, "Expired", config.color.border)}
      ${buttonsSection(input.productId, input.claimUrl)}
      <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#64748b;">Some manufacturers allow a grace period for claims. If you believe you're still eligible, check the claim link above or contact the seller directly.</p>
      `
    ),
  }
}

const templates: Record<ReminderType, (input: TemplateInput) => TemplateOutput> = {
  "7_days_before": sevenDayTemplate,
  "3_days_before": threeDayTemplate,
  expired: expiredTemplate,
}

export function renderEmail(
  reminderType: ReminderType,
  input: TemplateInput
): TemplateOutput {
  return templates[reminderType](input)
}
