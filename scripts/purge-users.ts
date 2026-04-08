// scripts/purge-users.ts
// Deletes all users (and their owned data) except demo@devstash.io
// Run with: npx tsx --env-file=.env scripts/purge-users.ts

import dotenv from "dotenv"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const KEEP_EMAIL = "demo@devstash.io"

async function main() {
  const targets = await prisma.user.findMany({
    where: { email: { not: KEEP_EMAIL } },
    select: { id: true, email: true },
  })

  if (targets.length === 0) {
    console.log("No users to delete.")
    return
  }

  console.log(`Deleting ${targets.length} user(s):`)
  targets.forEach((u) => console.log(`  - ${u.email} (${u.id})`))

  const ids = targets.map((u) => u.id)

  // Delete in dependency order to avoid FK violations
  await prisma.itemCollection.deleteMany({
    where: { item: { userId: { in: ids } } },
  })
  await prisma.item.deleteMany({ where: { userId: { in: ids } } })
  await prisma.collection.deleteMany({ where: { userId: { in: ids } } })
  await prisma.itemType.deleteMany({ where: { userId: { in: ids } } })
  await prisma.session.deleteMany({ where: { userId: { in: ids } } })
  await prisma.account.deleteMany({ where: { userId: { in: ids } } })
  await prisma.verificationToken.deleteMany({
    where: { identifier: { in: targets.map((u) => u.email) } },
  })
  await prisma.user.deleteMany({ where: { id: { in: ids } } })

  console.log("Done.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
