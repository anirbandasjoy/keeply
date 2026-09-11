export function formatUtcDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function toUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}
