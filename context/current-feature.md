# Current Feature

Dashboard Collections — Real Data

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Replace dummy collection data in the main dashboard area with real data from Neon via Prisma
- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in server component (no client fetching)
- Collection card border color derived from most-used content type in that collection
- Show small icons of all item types present in that collection
- Keep the current design intact — layout already exists
- Update collection stats display
- Do not add items underneath collections yet

## Notes

<!-- Any extra notes -->

- Reference: `context/features/dashboard-collections-spec.md`
- Reference screenshot: `context/screenshots/dashboard-ui-main.png`
- Do not touch mock data for anything else — only replace collections in the main area

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup — initialized Next.js 16.2.1 with React 19, Tailwind CSS v4, and TypeScript; cleaned up default boilerplate
- Dashboard UI Phase 1 — initialized ShadCN UI, added dashboard route at /dashboard, dark mode by default, top bar with search and new item button, sidebar and main area placeholders
- Dashboard UI Phase 2 — collapsible sidebar with types/collections nav, favorites and recent collections sections, user avatar area, mobile drawer support
- Dashboard UI Phase 3 — main content area with 4 stats cards, collections grid, pinned items, and recent items; components split into separate files using shadcn Card and Badge
- Database setup — installed Prisma 7.6.0 with Neon serverless adapter; created prisma/schema.prisma (all models + NextAuth), prisma.config.ts (Prisma 7 datasource config), src/lib/prisma.ts (singleton with PrismaNeon adapter + ws for Node.js), prisma/seed.ts (7 system item types); initial migration applied and seeded on dev branch
- Seed data — demo user (demo@devstash.io, bcrypt hashed), 7 system item types, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items total; seed is idempotent; scripts/test-db.ts added for full verification
