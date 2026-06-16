import Link from 'next/link'
import { createClient } from '@/lib/server'
import { LogoutButton } from '@/components/logout-button'

export async function AppHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initial = (
    (user?.user_metadata?.full_name as string | undefined)?.[0] ??
    (user?.user_metadata?.name as string | undefined)?.[0] ??
    user?.email?.[0] ??
    '?'
  ).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold text-foreground">
          My App
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div
                title={user.email}
                aria-label={`Signed in as ${user.email}`}
                className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground select-none"
              >
                {initial}
              </div>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
