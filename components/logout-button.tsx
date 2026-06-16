'use client'

import { useFormStatus } from 'react-dom'
import { signOutAction } from '@/app/actions'

function LogoutSubmit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60"
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <LogoutSubmit />
    </form>
  )
}
