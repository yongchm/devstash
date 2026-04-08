"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Github } from "@/components/ui/github-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toast, ToastContainer, type ToastType } from "@/components/ui/toast"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setToast({ message: "Account created! You can now sign in.", type: "success" })
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", { email, password, redirect: false })

    setLoading(false)
    if (result?.error) {
      if (result.code === "unverified_email") {
        setError("Please verify your email before signing in. Check your inbox.")
      } else {
        setError("Invalid email or password")
      }
    } else {
      setToast({ message: "Signed in successfully!", type: "success" })
      setTimeout(() => router.push("/dashboard"), 1000)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 px-6 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sign in to DevStash</h1>
            <p className="text-muted-foreground mt-1 text-sm">Welcome back</p>
          </div>

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            <Github className="h-4 w-4" />
            Sign in with GitHub
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
      {toast && (
        <ToastContainer>
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </ToastContainer>
      )}
    </>
  )
}
