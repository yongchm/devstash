// prisma.config.ts
// Prisma 7: datasource URL is configured here instead of schema.prisma
// This file is used by the Prisma CLI for migrations, generate, and seed

import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
