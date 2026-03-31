# Current Feature

Neon PostgreSQL + Prisma 7 Setup

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Install and configure Prisma 7 (note: breaking changes from v6 — read upgrade guide before writing any code)
- Connect to Neon PostgreSQL (serverless) via `DATABASE_URL`
- Create `prisma/schema.prisma` with full schema from project-overview.md: User, Item, ItemType, Collection, ItemCollection, Tag, plus NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes (as defined in schema)
- Create initial migration via `prisma migrate dev` (never `db push`)
- Create `prisma/seed.ts` to seed the 7 system item types
- Add `lib/prisma.ts` singleton client

## Notes

<!-- Any extra notes -->

- Always use migrations — never `prisma db push` directly
- Dev branch uses `DATABASE_URL`; production uses a separate branch
- Prisma 7 has breaking changes — fetch and read the full upgrade guide before implementation
- `@db.Text` annotations required for long text fields (content, description, tokens)

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup — initialized Next.js 16.2.1 with React 19, Tailwind CSS v4, and TypeScript; cleaned up default boilerplate
- Dashboard UI Phase 1 — initialized ShadCN UI, added dashboard route at /dashboard, dark mode by default, top bar with search and new item button, sidebar and main area placeholders
- Dashboard UI Phase 2 — collapsible sidebar with types/collections nav, favorites and recent collections sections, user avatar area, mobile drawer support
- Dashboard UI Phase 3 — main content area with 4 stats cards, collections grid, pinned items, and recent items; components split into separate files using shadcn Card and Badge
- Database setup — installed Prisma 7.6.0 with Neon serverless adapter; created prisma/schema.prisma (all models + NextAuth), prisma.config.ts (Prisma 7 datasource config), src/lib/prisma.ts (singleton with PrismaNeon adapter + ws for Node.js), prisma/seed.ts (7 system item types); migration pending — requires DATABASE_URL
