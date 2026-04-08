import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return <Result error="Missing verification token." />
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record) {
    return <Result error="Invalid or already used verification link." />
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return <Result error="This verification link has expired. Please register again." />
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({ where: { token } })

  return <Result success />
}

function Result({ success, error }: { success?: boolean; error?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm text-center space-y-4 px-6 py-10">
        {success ? (
          <>
            <div className="text-4xl">✓</div>
            <h1 className="text-xl font-semibold">Email verified</h1>
            <p className="text-sm text-muted-foreground">Your email has been verified. You can now sign in.</p>
            <Link
              href="/sign-in"
              className="inline-block mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            <div className="text-4xl">✗</div>
            <h1 className="text-xl font-semibold">Verification failed</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Link
              href="/register"
              className="inline-block mt-2 text-sm text-foreground font-medium hover:underline"
            >
              Back to register
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
