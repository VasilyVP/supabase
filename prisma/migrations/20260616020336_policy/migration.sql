-- Enable RLS on Post and enforce role-aware access.
-- Prisma's shadow database is plain Postgres, so Supabase auth schema/roles may not exist.
DO $$
BEGIN
	IF to_regnamespace('auth') IS NULL THEN
		RAISE NOTICE 'Skipping Post RLS policy setup: auth schema does not exist in this database';
		RETURN;
	END IF;

	EXECUTE 'ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY';

	-- Reset policies so this migration is repeatable in local rebuilds.
	EXECUTE 'DROP POLICY IF EXISTS "post_admin_all" ON "Post"';
	EXECUTE 'DROP POLICY IF EXISTS "post_author_select_own" ON "Post"';
	EXECUTE 'DROP POLICY IF EXISTS "post_author_insert_own" ON "Post"';
	EXECUTE 'DROP POLICY IF EXISTS "post_author_update_own" ON "Post"';
	EXECUTE 'DROP POLICY IF EXISTS "post_author_delete_own" ON "Post"';
	EXECUTE 'DROP POLICY IF EXISTS "post_reader_select_all" ON "Post"';
	EXECUTE 'DROP POLICY IF EXISTS "post_anon_select_list" ON "Post"';

	-- Only create role-bound policies when Supabase roles exist.
	IF to_regrole('authenticated') IS NOT NULL THEN
		-- Admins (from JWT app_metadata.role) can fully manage all posts.
		EXECUTE 'CREATE POLICY "post_admin_all"
			ON "Post"
			FOR ALL
			TO authenticated
			USING ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')
			WITH CHECK ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')';

		-- Authors can access and manage only their own rows.
		EXECUTE 'CREATE POLICY "post_author_select_own"
			ON "Post"
			FOR SELECT
			TO authenticated
			USING ((SELECT auth.uid()) = "authorId" AND (auth.jwt() -> ''app_metadata'' ->> ''role'') = ''author'')';

		EXECUTE 'CREATE POLICY "post_author_insert_own"
			ON "Post"
			FOR INSERT
			TO authenticated
			WITH CHECK ((SELECT auth.uid()) = "authorId" AND (auth.jwt() -> ''app_metadata'' ->> ''role'') = ''author'')';

		EXECUTE 'CREATE POLICY "post_author_update_own"
			ON "Post"
			FOR UPDATE
			TO authenticated
			USING ((SELECT auth.uid()) = "authorId" AND (auth.jwt() -> ''app_metadata'' ->> ''role'') = ''author'')
			WITH CHECK ((SELECT auth.uid()) = "authorId" AND (auth.jwt() -> ''app_metadata'' ->> ''role'') = ''author'')';

		EXECUTE 'CREATE POLICY "post_author_delete_own"
			ON "Post"
			FOR DELETE
			TO authenticated
			USING ((SELECT auth.uid()) = "authorId" AND (auth.jwt() -> ''app_metadata'' ->> ''role'') = ''author'')';

		-- Readers (from JWT app_metadata.role) can read all post columns/rows.
		EXECUTE 'CREATE POLICY "post_reader_select_all"
			ON "Post"
			FOR SELECT
			TO authenticated
			USING ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''reader'')';

		EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "Post" TO authenticated';
	END IF;

	IF to_regrole('anon') IS NOT NULL THEN
		-- Anonymous users can read rows, but column grants limit data to post list metadata.
		EXECUTE 'CREATE POLICY "post_anon_select_list"
			ON "Post"
			FOR SELECT
			TO anon
			USING (true)';

		EXECUTE 'REVOKE ALL ON TABLE "Post" FROM anon';
		EXECUTE 'GRANT SELECT ("id", "title", "authorId", "createdAt") ON TABLE "Post" TO anon';
	END IF;
END
$$;