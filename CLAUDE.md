# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @devstash/context/project-overview.md
- @devstash/context/coding-standards.md
- @devstash/context/ai-interaction.md
- @devstash/context/current-feature.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16.2.1** (App Router) — see AGENTS.md warning about breaking changes
- **React 19** with React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — no `tailwind.config.*` file; configuration goes in `globals.css` using `@theme`
- **TypeScript** strict mode; path alias `@/*` → `src/*`
