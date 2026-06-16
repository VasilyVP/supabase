# Supabase + Next.js Example

This repository is a minimal full-stack example that combines Next.js App Router with Supabase local development.

## What this project demonstrates

- Email/password authentication with Supabase Auth (sign in + sign out).
- Session-aware route protection in `proxy.ts`.
- Typed Supabase clients for server and browser usage.
- Row-level-security-aware data reads from `Post` (different visibility for anon vs authenticated users).
- Supabase Edge Function invocation from the app (`edge-runner`) with user auth context.
- Prisma-managed schema and migrations for local database evolution.

## Stack

- Next.js 16
- Supabase (local stack + Edge Functions)
- Prisma (schema/migrations/seed)
- TypeScript

## Prerequisites

- Bun (recommended in this repo) or npm
- Docker Desktop (required by Supabase local stack)
- Supabase CLI

## Required environment variables

Create `.env.local` in the repo root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
DATABASE_URL=
```

Notes:

- `DATABASE_URL` can be replaced with `NEXT_PUBLIC_DATABASE_URL` for Prisma config.
- For local development values, start Supabase and read connection details from `supabase status`.

## Core commands

Install dependencies:

```bash
bun install
```

Start app + Supabase local stack together:

```bash
make start-dev
```

Stop local Supabase services:

```bash
make stop-dev
```

Run only Next.js app:

```bash
bun run dev
```

## Database workflow (core)

Create a migration from schema changes:

```bash
bun run prisma:migrate -- <migration_name>
```

Generate Prisma client (used by scripts/tools):

```bash
bun run prisma:generate
```

Seed local auth users and posts:

```bash
bun run seed
```

## Local URLs

- App: http://127.0.0.1:3000
- Supabase API: http://127.0.0.1:54321
- Supabase Studio: http://127.0.0.1:54323

## Project structure (core)

- `app/`: Next.js App Router pages and server actions.
- `proxy.ts`: session refresh + route guarding.
- `lib/server.ts`, `lib/client.ts`: Supabase SSR/browser clients.
- `supabase/`: local Supabase config and Edge Functions.
- `prisma/`: schema and migrations.
- `scripts/seed.ts`: idempotent local seed script.

## Important repo convention

In runtime app code, use Supabase clients for database access. Prisma is used for schema, migrations, generation, and scripts (for example `scripts/seed.ts`).
