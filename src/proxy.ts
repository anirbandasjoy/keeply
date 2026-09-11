import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/products",
  "/email-history",
  "/settings",
  "/admin",
]

function getSupabaseEnv(): { url: string; publishableKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return { url, publishableKey }
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, publishableKey } = getSupabaseEnv()

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
  const isAdminPath = path === "/admin" || path.startsWith("/admin/")

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (user && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (user && isAdminPath && user.app_metadata?.["role"] !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
