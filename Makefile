start-dev:
	@concurrently -n "supabase,nextjs" -c "green,blue" \
		"bunx supabase start" \
		"bunx next dev" 

stop-dev:
	bunx supabase stop

prisma-migration:
	bunx --bun prisma migrate dev --config prisma/prisma.config.ts --name $(name)

prisma-migration-create:
	bunx --bun prisma migrate dev --config prisma/prisma.config.ts --name $(name) --create-only

prisma-migrate:
	bunx --bun prisma migrate deploy --config prisma/prisma.config.ts

# Not needed for the codebase. Only for seeding the database with Prisma Client.
prisma-generate:
	bunx --bun prisma generate --config prisma/prisma.config.ts

prisma-reset:
	bunx --bun prisma migrate reset --config prisma/prisma.config.ts --force

seed:
	bun run seed
