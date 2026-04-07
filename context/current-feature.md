# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup — initialized Next.js 16.2.1 with React 19, Tailwind CSS v4, and TypeScript; cleaned up default boilerplate
- Dashboard UI Phase 1 — initialized ShadCN UI, added dashboard route at /dashboard, dark mode by default, top bar with search and new item button, sidebar and main area placeholders
- Dashboard UI Phase 2 — collapsible sidebar with types/collections nav, favorites and recent collections sections, user avatar area, mobile drawer support
- Dashboard UI Phase 3 — main content area with 4 stats cards, collections grid, pinned items, and recent items; components split into separate files using shadcn Card and Badge
- Database setup — installed Prisma 7.6.0 with Neon serverless adapter; created prisma/schema.prisma (all models + NextAuth), prisma.config.ts (Prisma 7 datasource config), src/lib/prisma.ts (singleton with PrismaNeon adapter + ws for Node.js), prisma/seed.ts (7 system item types); initial migration applied and seeded on dev branch
- Seed data — demo user (demo@devstash.io, bcrypt hashed), 7 system item types, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items total; seed is idempotent; scripts/test-db.ts added for full verification
- Dashboard Collections Real Data — replaced dummy collection data with real Neon/Prisma data; created src/lib/db/collections.ts; collection card border color derived from most-used content type; small icons for all item types present in each collection
- Dashboard Items Real Data — replaced dummy item data with real Neon/Prisma data; created src/lib/db/items.ts with getPinnedItems, getRecentItems, getItemStats; item card icon/border derived from item type; pinned section hidden when empty; stats wired to real counts
- Stats & Sidebar Real Data — wired stats cards to real DB counts; replaced sidebar mock data with live item types (with counts) and collections; item types link to /items/[typename]; favorite collections show star icons; recent collections show colored dot based on dominant item type; added "View all collections" link
- Code Quality Quick Wins — replaced N+1 query in getItemTypesWithCounts with Prisma _count aggregation; removed non-null assertion on DATABASE_URL in prisma.config.ts; deleted unused getTypeMeta() export from item-type-meta.ts
- Auth Setup - NextAuth v5 + GitHub OAuth — installed next-auth@beta and @auth/prisma-adapter; split auth config for edge compatibility; GitHub provider; /dashboard/* protected via src/proxy.ts with named proxy export; session extended with user.id; AUTH_URL required in .env for production host trust
