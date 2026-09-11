import { getGroq } from "./groq"
import {
  scanDocumentSchema,
  type ScanDocumentResult,
} from "@/schemas/scan-document"

const ANALYSIS_PROMPT = `You are a document analyzer for a product tracking app. The user will provide content from a receipt, invoice, guarantee paper, or warranty card. Extract structured product data.

Return ONLY valid JSON matching this exact schema:
{
  "name": "product name as a string",
  "type": "warranty" | "guarantee" | "subscription",
  "purchase_date": "YYYY-MM-DD format",
  "duration": number of days from purchase until expiry,
  "category": "Electronics" | "Home & Kitchen" | "Fashion & Accessories" | "Digital Products" | "Automotive" | "Health & Beauty" | "Sports & Outdoors" | "Travel" | "Other" or null,
  "notes": "any relevant notes from the document" or null,
  "claim_url": "https://..." or null
}

Rules:
- If the purchase date is visible, use it. If not, use today's date.
- If the duration or expiry is not explicitly stated, use these defaults: Electronics 365 days, Appliances 730 days, Subscriptions 30 days, General guarantee 365 days.
- For type, infer from keywords: warranty, guarantee, subscription, plan, policy.
- For category, infer from the product name or description.
- For claim_url, look for any URL, phone number, or website on the document.
- Return ONLY the JSON object, no explanation or markdown.`

function parseResponse(content: string): ScanDocumentResult {
  const parsed = JSON.parse(content) as unknown
  const result = scanDocumentSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error("Could not extract valid data from document")
  }
  return result.data
}

export async function scanDocumentFromImage(
  imageUrl: string
): Promise<ScanDocumentResult> {
  const completion = await getGroq().chat.completions.create({
    model: "qwen/qwen3.8-27b",
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the product information from this document image.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    temperature: 0.1,
    max_completion_tokens: 1024,
    response_format: { type: "json_object" },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error("No response from AI")

  return parseResponse(content)
}

export async function scanDocumentFromText(
  text: string
): Promise<ScanDocumentResult> {
  const completion = await getGroq().chat.completions.create({
    model: "qwen/qwen3.8-27b",
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      {
        role: "user",
        content: `Extract the product information from this document text:\n\n${text}`,
      },
    ],
    temperature: 0.1,
    max_completion_tokens: 1024,
    response_format: { type: "json_object" },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error("No response from AI")

  return parseResponse(content)
}
