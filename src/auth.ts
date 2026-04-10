import NextAuth, { CredentialsSignin } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { flags } from "@/lib/flags"
import authConfig from "@/auth.config"

class UnverifiedEmailError extends CredentialsSignin {
  code = "unverified_email"
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
  ...authConfig,
  providers: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...authConfig.providers.filter((p: any) => p.id !== "credentials"),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user?.password) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        )

        if (!passwordMatch) return null

        if (flags.emailVerification && !user.emailVerified) throw new UnverifiedEmailError()

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],
})
