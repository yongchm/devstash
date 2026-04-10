export const flags = {
  /** Set EMAIL_VERIFICATION_ENABLED=false in .env to bypass verification during development */
  emailVerification: process.env.EMAIL_VERIFICATION_ENABLED !== "false",
}
