'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export type LoginState = {
  error: string | null
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Please provide both email and password.' }
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || !password) {
    return { error: 'Please provide both email and password.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  redirect('/')
}