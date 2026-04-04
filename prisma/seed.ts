// prisma/seed.ts
// Run with: npm run db:seed
// Idempotent — safe to re-run without duplicating data.

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ContentType } from "../src/generated/prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// SYSTEM ITEM TYPES
// ============================================================
const systemItemTypes = [
  { name: "snippet", icon: "Code",       color: "#3b82f6", isSystem: true },
  { name: "prompt",  icon: "Sparkles",   color: "#8b5cf6", isSystem: true },
  { name: "command", icon: "Terminal",   color: "#f97316", isSystem: true },
  { name: "note",    icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "file",    icon: "File",       color: "#6b7280", isSystem: true },
  { name: "image",   icon: "Image",      color: "#ec4899", isSystem: true },
  { name: "link",    icon: "Link",       color: "#10b981", isSystem: true },
];

async function main() {
  // ── System item types ──────────────────────────────────────
  console.log("Seeding system item types...");
  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });
    if (!existing) await prisma.itemType.create({ data: type });
  }

  const typeMap = Object.fromEntries(
    (await prisma.itemType.findMany({ where: { isSystem: true } })).map(
      (t) => [t.name, t.id]
    )
  );

  // ── Demo user ──────────────────────────────────────────────
  console.log("Seeding demo user...");
  const passwordHash = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // ── Helper ─────────────────────────────────────────────────
  async function upsertCollection(name: string, description: string, isFavorite = false) {
    const existing = await prisma.collection.findFirst({
      where: { name, userId: user.id },
    });
    if (existing) {
      return prisma.collection.update({
        where: { id: existing.id },
        data: { isFavorite },
      });
    }
    return prisma.collection.create({
      data: { name, description, isFavorite, userId: user.id },
    });
  }

  async function upsertItem(data: {
    title: string;
    contentType: ContentType;
    content?: string;
    url?: string;
    description?: string;
    language?: string;
    isFavorite?: boolean;
    isPinned?: boolean;
    itemTypeId: string;
  }) {
    const existing = await prisma.item.findFirst({
      where: { title: data.title, userId: user.id },
    });
    if (existing) {
      return prisma.item.update({
        where: { id: existing.id },
        data: { isFavorite: data.isFavorite ?? false, isPinned: data.isPinned ?? false },
      });
    }
    return prisma.item.create({ data: { ...data, userId: user.id } });
  }

  async function linkItemToCollection(itemId: string, collectionId: string) {
    const existing = await prisma.itemCollection.findUnique({
      where: { itemId_collectionId: { itemId, collectionId } },
    });
    if (!existing) {
      await prisma.itemCollection.create({ data: { itemId, collectionId } });
    }
  }

  // ── React Patterns ─────────────────────────────────────────
  console.log("Seeding React Patterns...");
  const reactPatterns = await upsertCollection(
    "React Patterns",
    "Reusable React patterns and hooks",
    true
  );

  const reactItems = await Promise.all([
    upsertItem({
      title: "useDebounce hook",
      contentType: ContentType.TEXT,
      language: "typescript",
      isFavorite: true,
      isPinned: true,
      itemTypeId: typeMap.snippet,
      content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    }),
    upsertItem({
      title: "Context provider pattern",
      contentType: ContentType.TEXT,
      language: "typescript",
      itemTypeId: typeMap.snippet,
      content: `import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
    }),
    upsertItem({
      title: "cn utility (clsx + tailwind-merge)",
      contentType: ContentType.TEXT,
      language: "typescript",
      itemTypeId: typeMap.snippet,
      content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
    }),
  ]);

  for (const item of reactItems) {
    await linkItemToCollection(item.id, reactPatterns.id);
  }

  // ── AI Workflows ───────────────────────────────────────────
  console.log("Seeding AI Workflows...");
  const aiWorkflows = await upsertCollection(
    "AI Workflows",
    "AI prompts and workflow automations",
    true
  );

  const aiItems = await Promise.all([
    upsertItem({
      title: "Code review prompt",
      contentType: ContentType.TEXT,
      isFavorite: true,
      isPinned: true,
      itemTypeId: typeMap.prompt,
      content: `You are an expert code reviewer. Review the following code and provide feedback on:

1. **Correctness** — Are there any bugs or edge cases?
2. **Performance** — Are there obvious inefficiencies?
3. **Readability** — Is the code clear and well-structured?
4. **Security** — Are there any vulnerabilities?
5. **Best practices** — Does it follow conventions for the language/framework?

Be concise. Use bullet points. Suggest specific improvements with code examples where helpful.

\`\`\`
{code}
\`\`\``,
    }),
    upsertItem({
      title: "Documentation generation prompt",
      contentType: ContentType.TEXT,
      itemTypeId: typeMap.prompt,
      content: `Generate clear, concise documentation for the following code.

Include:
- A one-line summary
- Parameters/props with types and descriptions
- Return value (if applicable)
- A usage example

Output in JSDoc format for TypeScript/JavaScript, or docstring format for Python.

\`\`\`
{code}
\`\`\``,
    }),
    upsertItem({
      title: "Refactoring assistant prompt",
      contentType: ContentType.TEXT,
      itemTypeId: typeMap.prompt,
      content: `Refactor the following code to improve readability and maintainability without changing its behavior.

Goals:
- Extract reusable logic into named functions
- Remove duplication
- Use descriptive variable names
- Apply relevant design patterns if appropriate
- Keep it simple — don't over-engineer

Show the refactored version with a brief explanation of the changes made.

\`\`\`
{code}
\`\`\``,
    }),
  ]);

  for (const item of aiItems) {
    await linkItemToCollection(item.id, aiWorkflows.id);
  }

  // ── DevOps ─────────────────────────────────────────────────
  console.log("Seeding DevOps...");
  const devops = await upsertCollection(
    "DevOps",
    "Infrastructure and deployment resources"
  );

  const devopsItems = await Promise.all([
    upsertItem({
      title: "Dockerfile — Node.js app",
      contentType: ContentType.TEXT,
      language: "dockerfile",
      itemTypeId: typeMap.snippet,
      content: `FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
EXPOSE 3000
CMD ["npm", "start"]`,
    }),
    upsertItem({
      title: "Deploy to production",
      contentType: ContentType.TEXT,
      language: "bash",
      itemTypeId: typeMap.command,
      content: `# Pull latest, run migrations, restart
git pull origin main && \\
  npx prisma migrate deploy && \\
  pm2 restart all`,
    }),
    upsertItem({
      title: "GitHub Actions docs",
      contentType: ContentType.URL,
      url: "https://docs.github.com/en/actions",
      description: "Official GitHub Actions documentation",
      itemTypeId: typeMap.link,
    }),
    upsertItem({
      title: "Docker docs",
      contentType: ContentType.URL,
      url: "https://docs.docker.com",
      description: "Official Docker documentation",
      itemTypeId: typeMap.link,
    }),
  ]);

  for (const item of devopsItems) {
    await linkItemToCollection(item.id, devops.id);
  }

  // ── Terminal Commands ──────────────────────────────────────
  console.log("Seeding Terminal Commands...");
  const terminal = await upsertCollection(
    "Terminal Commands",
    "Useful shell commands for everyday development"
  );

  const terminalItems = await Promise.all([
    upsertItem({
      title: "Git — undo last commit (keep changes)",
      contentType: ContentType.TEXT,
      language: "bash",
      isFavorite: true,
      itemTypeId: typeMap.command,
      content: `git reset --soft HEAD~1`,
    }),
    upsertItem({
      title: "Docker — remove all stopped containers and unused images",
      contentType: ContentType.TEXT,
      language: "bash",
      itemTypeId: typeMap.command,
      content: `docker container prune -f && docker image prune -f`,
    }),
    upsertItem({
      title: "Kill process on port",
      contentType: ContentType.TEXT,
      language: "bash",
      itemTypeId: typeMap.command,
      content: `# macOS / Linux
lsof -ti :<port> | xargs kill -9

# Windows
netstat -ano | findstr :<port>
taskkill /PID <pid> /F`,
    }),
    upsertItem({
      title: "npm — list and remove unused packages",
      contentType: ContentType.TEXT,
      language: "bash",
      itemTypeId: typeMap.command,
      content: `# Check for unused dependencies
npx depcheck

# Remove a package and update package.json
npm uninstall <package-name>`,
    }),
  ]);

  for (const item of terminalItems) {
    await linkItemToCollection(item.id, terminal.id);
  }

  // ── Design Resources ───────────────────────────────────────
  console.log("Seeding Design Resources...");
  const design = await upsertCollection(
    "Design Resources",
    "UI/UX resources and references"
  );

  const designItems = await Promise.all([
    upsertItem({
      title: "Tailwind CSS docs",
      contentType: ContentType.URL,
      url: "https://tailwindcss.com/docs",
      description: "Official Tailwind CSS documentation and utility reference",
      isFavorite: true,
      itemTypeId: typeMap.link,
    }),
    upsertItem({
      title: "shadcn/ui components",
      contentType: ContentType.URL,
      url: "https://ui.shadcn.com/docs/components",
      description: "Accessible, unstyled component library built on Radix UI",
      itemTypeId: typeMap.link,
    }),
    upsertItem({
      title: "Radix UI primitives",
      contentType: ContentType.URL,
      url: "https://www.radix-ui.com/primitives",
      description: "Unstyled, accessible UI primitives for React",
      itemTypeId: typeMap.link,
    }),
    upsertItem({
      title: "Lucide icons",
      contentType: ContentType.URL,
      url: "https://lucide.dev/icons",
      description: "Open-source icon library used throughout the app",
      itemTypeId: typeMap.link,
    }),
  ]);

  for (const item of designItems) {
    await linkItemToCollection(item.id, design.id);
  }

  console.log("\nSeed complete!");
  console.log(`  User:        ${user.email}`);
  console.log(`  Item types:  ${systemItemTypes.length}`);
  console.log(`  Collections: 5`);
  console.log(`  Items:       ${reactItems.length + aiItems.length + devopsItems.length + terminalItems.length + designItems.length}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
