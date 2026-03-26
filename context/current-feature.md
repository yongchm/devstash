# Current Feature

Dashboard UI Phase 2

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Collapsible sidebar (desktop: visible and collapsible; mobile/tablet: always a drawer)
- Items/types list in sidebar with links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorite collections section in sidebar
- Most recent collections section in sidebar
- User avatar area at the bottom of the sidebar
- Drawer icon to open/close the sidebar

## Notes

<!-- Any extra notes -->

- Reference screenshot: `@context/screenshots/dashboard-ui-main.png`
- Use mock data from `@src/lib/mock-data.ts` (import directly, no DB yet)
- On mobile/tablet (< 1024px), sidebar is always a drawer (hidden by default)

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup — initialized Next.js 16.2.1 with React 19, Tailwind CSS v4, and TypeScript; cleaned up default boilerplate
- Dashboard UI Phase 1 — initialized ShadCN UI, added dashboard route at /dashboard, dark mode by default, top bar with search and new item button, sidebar and main area placeholders
