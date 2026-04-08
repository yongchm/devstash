import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.AUTH_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: email,
    subject: "Verify your DevStash email",
    html: `
      <p>Thanks for signing up for DevStash.</p>
      <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
      <p><a href="${url}">Verify email</a></p>
      <p>Or copy this URL into your browser:<br>${url}</p>
    `,
  })
}
