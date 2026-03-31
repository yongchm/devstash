// scripts/test-db.ts
// Quick sanity check for the database connection and seeded data.
// Run with: npx tsx --env-file=.env scripts/test-db.ts

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // 1. Raw connectivity
  const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
  console.log("✓ Connected to database:", result[0].now.toISOString());

  // 2. System item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`\n✓ System item types (${itemTypes.length}/7):`);
  for (const t of itemTypes) {
    console.log(`  - ${t.name} | icon: ${t.icon} | color: ${t.color}`);
  }

  // 3. Table counts
  const [users, collections, items, tags] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);
  console.log("\n✓ Table counts:");
  console.log(`  users: ${users}`);
  console.log(`  collections: ${collections}`);
  console.log(`  items: ${items}`);
  console.log(`  tags: ${tags}`);

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("Test failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
