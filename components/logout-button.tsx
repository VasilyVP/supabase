'use client'

import { useFormStatus } from 'react-dom'
import { signOutAction } from '@/app/actions'


export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <form action={signOutAction}>
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60"
      >
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
    </form>
  )
}
