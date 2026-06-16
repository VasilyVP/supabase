<!-- BEGIN:nextjs-agent-rules -->
# Agent Instructions For This Repository

## Critical Framework Rule

This project uses **Next.js 16.2.6** with changed conventions.
Before implementing non-trivial Next.js changes, read the relevant guide in `node_modules/next/dist/docs/` and follow deprecation notices.

## Quick Start Commands

- Install deps: `bun install`
- App dev server: `bun run dev` (or `npm run dev`)
- Lint: `bun run lint`
- Build: `bun run build`

## Local Stack Commands

- Start Supabase + Next together: `make start-dev`
- Stop Supabase local stack: `make stop-dev`
- Prisma generate: `make prisma-generate` or `bun run prisma:generate`
- Prisma migration (dev): `make prisma-migrate name=<migration_name>` or `bun run prisma:migrate -- <migration_name>`

## Architecture Snapshot

- App Router entrypoints: `app/layout.tsx`, `app/page.tsx`
- Request interception/auth gating is in `proxy.ts` (Next 16 rename from middleware)
- Supabase SSR clients:
	- Server: `lib/server.ts`
	- Browser: `lib/client.ts`
- Prisma schema/config:
	- `prisma/schema.prisma`
	- `prisma/prisma.config.ts`
- Supabase local config: `supabase/config.toml`

## Project Conventions

- Prefer the `@/*` import alias from `tsconfig.json`.
- In app runtime code, do not use Prisma for data access; use Supabase clients (`lib/server.ts` / `lib/client.ts`) for all DB requests.
- Prisma is limited to DB modeling, migrations, client generation, and scripts (for example `scripts/seed.ts`).
- Keep auth/session checks centralized in `proxy.ts`; avoid duplicating route protection logic in pages.
- If changing auth flows, verify redirect URLs and site URL assumptions in `supabase/config.toml`.
- For DB URL resolution, note `prisma/prisma.config.ts` accepts `DATABASE_URL` or `NEXT_PUBLIC_DATABASE_URL`.

## Auth Pitfalls To Avoid

- Do not rename `proxy.ts` to `middleware.ts` in Next 16.
- Keep recovery and callback query params (`code`, `token_hash`) intact through auth redirects.
- Avoid redirecting signed-in users away from `/login` when auth callback params are present.

## Where To Read More (Link, Don’t Duplicate)

- Project scaffold docs: `README.md`
- Scripts and runtime versions: `package.json`
- Combined local workflows: `Makefile`
- Additional reusable guidance:
	- `.agents/skills/next-best-practices/SKILL.md`
	- `.agents/skills/supabase/SKILL.md`
	- `.agents/skills/supabase-postgres-best-practices/SKILL.md`
<!-- END:nextjs-agent-rules -->
