import Groq from "groq-sdk"

let _groq: Groq | null = null

export function getGroq(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY environment variable")
    }
    _groq = new Groq({ apiKey })
  }
  return _groq
}
