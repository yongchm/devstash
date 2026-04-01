// scripts/test-db.ts
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

function section(title: string) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(50));
}

async function main() {
  // ── 1. Connectivity ────────────────────────────────────────
  section("CONNECTION");
  const [{ now }] = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
  console.log(`  ✓ Connected at ${now.toISOString()}`);

  // ── 2. System item types ───────────────────────────────────
  section("SYSTEM ITEM TYPES");
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`  Found: ${itemTypes.length}/7\n`);
  for (const t of itemTypes) {
    console.log(`  ${t.color}  ${t.name.padEnd(10)}  icon: ${t.icon}`);
  }

  // ── 3. Demo user ───────────────────────────────────────────
  section("DEMO USER");
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });
  if (!user) throw new Error("Demo user not found — run npm run db:seed first");
  console.log(`  email:         ${user.email}`);
  console.log(`  name:          ${user.name}`);
  console.log(`  isPro:         ${user.isPro}`);
  console.log(`  emailVerified: ${user.emailVerified?.toISOString() ?? "null"}`);
  console.log(`  password hash: ${user.password ? "✓ set" : "✗ missing"}`);

  // ── 4. Collections with item counts ───────────────────────
  section("COLLECTIONS");
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  console.log(`  Found: ${collections.length}/5\n`);
  for (const c of collections) {
    console.log(`  • ${c.name.padEnd(24)} ${c._count.items} item(s)  — ${c.description}`);
  }

  // ── 5. Items by collection ─────────────────────────────────
  section("ITEMS BY COLLECTION");
  const collectionsWithItems = await prisma.collection.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          item: { include: { itemType: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  for (const col of collectionsWithItems) {
    console.log(`\n  [${col.name}]`);
    for (const { item } of col.items) {
      const flags = [
        item.isFavorite ? "★ fav" : "",
        item.isPinned   ? "📌 pinned" : "",
        item.language   ? `lang:${item.language}` : "",
        item.url        ? `url: ${item.url}` : "",
      ].filter(Boolean).join("  ");
      console.log(`    - [${item.itemType.name.padEnd(8)}] ${item.title}${flags ? `  (${flags})` : ""}`);
    }
  }

  // ── 6. Summary ─────────────────────────────────────────────
  section("SUMMARY");
  const [users, colCount, itemCount, tags] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);
  console.log(`  users:       ${users}`);
  console.log(`  collections: ${colCount}`);
  console.log(`  items:       ${itemCount}`);
  console.log(`  tags:        ${tags}`);
  console.log(`\n  ✓ All checks passed.`);
}

main()
  .catch((e) => {
    console.error("\nTest failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
