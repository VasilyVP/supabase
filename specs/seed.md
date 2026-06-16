# Seed Script Spec

## Goal

Create a seed script that populates existing local data for development.

## Seed Data

### Users

Create three fake users with the following roles using Supabase Auth, not direct database inserts:

* `admin`
* `author`
* `reader`

Use stable fake email addresses so the script can detect existing auth users reliably.
Store the role in Supabase Auth metadata, not in a database table. Prefer `app_metadata.role` unless the implementation needs a different auth metadata field.

### Posts

Create three posts authored by the `author` auth user:

* Title: `First Post`, content: `This is the first post`
* Title: `Second Post`, content: `This is the second post`
* Title: `Third Post`, content: `This is the third post`

## Behavior

The seed script must be idempotent.

* Running the script multiple times must not create duplicate users or posts.
* Before creating a user in Supabase Auth, the script must check whether that auth user already exists.
* Before inserting a post, the script must check whether that post already exists.
* If a matching auth user or post already exists, the script must reuse it instead of creating a new one.
* If an existing auth user is found but the stored role is missing or different, the script should update the auth metadata to match the seed definition.
* The `author` auth user must be the one associated with all three posts.

## Matching Rules

Use stable unique fields for existence checks:

* Auth users should be matched by email.
* Posts should be matched by title.
* The `author` user should be the only post author created by the seed script.

## Expected Outcome

After a successful run, the local environment contains exactly:

* 3 users with the roles above
* 3 posts owned by the `author` user

Running the seed again should leave the dataset unchanged.

## Scope

This task does not create or modify database tables or schema. It only populates existing Supabase Auth users and existing post records.
It should not assume any `users` table exists in the database.
