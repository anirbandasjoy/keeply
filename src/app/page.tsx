import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-background px-4 py-24">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Keeply
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Never miss a warranty, guarantee or subscription expiration again.
          Keeply tracks expiry dates and emails you before they slip away.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href="/login" />}>
          Get started
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/login" />}>
          Sign in
        </Button>
      </div>
    </main>
  )
}
