// Prisma 7: import from generated output path, not @prisma/client
// Uses standard pg Pool + PrismaPg adapter (Node.js runtime).
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Ensure .env is loaded — Next.js auto-loads it but this guards against
// edge cases where the module is evaluated before the runtime env is set.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Check your .env file."
      );
    }
    const pool = new Pool({ connectionString });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
