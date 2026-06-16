import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use your Supabase account credentials to continue.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}