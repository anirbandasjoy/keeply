import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlertIcon } from "lucide-react"
import { GoogleSignInButton } from "./google-sign-in-button"

export function LoginView({ authFailed }: { authFailed: boolean }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign in to Keeply</CardTitle>
            <CardDescription>
              Track warranties, guarantees and subscriptions in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {authFailed ? (
              <Alert variant="destructive">
                <TriangleAlertIcon />
                <AlertTitle>Sign in failed</AlertTitle>
                <AlertDescription>
                  We could not complete the Google sign in. Please try again.
                </AlertDescription>
              </Alert>
            ) : null}
            <GoogleSignInButton />
            <p className="text-center text-xs text-muted-foreground">
              Use your Google account. No passwords required.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
