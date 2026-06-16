start-dev:
	@concurrently -n "supabase,sup-functions,nextjs" -c "white,green,blue" \
		"bunx supabase start" \
		"bunx supabase functions serve" \
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

supabase-types:
	node -e "require('fs').mkdirSync('generated/supabase',{recursive:true})"
	bunx supabase gen types typescript --local --schema public > generated/supabase/database.types.ts
