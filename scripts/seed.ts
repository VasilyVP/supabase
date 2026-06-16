import { loadEnvConfig } from '@next/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '../generated/prisma/client'

loadEnvConfig(process.cwd())

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY!
const DATABASE_URL = (process.env.DATABASE_URL ?? process.env.NEXT_PUBLIC_DATABASE_URL)!

const SEED_USERS = [
  { email: 'admin@seed.local', password: 'password-admin', role: 'admin' },
  { email: 'author@seed.local', password: 'password-author', role: 'author' },
  { email: 'author2@seed.local', password: 'password-author2', role: 'author' },
  { email: 'reader@seed.local', password: 'password-reader', role: 'reader' },
]

const SEED_POSTS = [
  { title: 'First Post', content: 'This is the first post', author: 'author@seed.local' },
  { title: 'Second Post', content: 'This is the second post', author: 'author@seed.local' },
  { title: 'Third Post', content: 'This is the third post', author: 'author@seed.local' },
  { title: 'Fourth Post', content: 'This is the fourth post', author: 'author2@seed.local' },
]

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })

  // --- Seed users ---
  const userIdsByEmail: Record<string, string> = {}

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) throw listError

  const existingByEmail = new Map(listData.users.map((u) => [u.email, u]))

  for (const { email, password, role } of SEED_USERS) {
    const existing = existingByEmail.get(email)

    if (existing) {
      userIdsByEmail[email] = existing.id
      const currentRole = (existing.app_metadata as Record<string, unknown>)?.role
      if (currentRole !== role) {
        const { error } = await supabase.auth.admin.updateUserById(existing.id, {
          app_metadata: { role },
        })
        if (error) throw error
        console.log(`Updated role for ${email}: ${currentRole} -> ${role}`)
      } else {
        console.log(`User already exists (no change): ${email}`)
      }
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        app_metadata: { role },
        email_confirm: true,
      })
      if (error) throw error
      userIdsByEmail[email] = data.user.id
      console.log(`Created user: ${email} (${role})`)
    }
  }

  const authorSeedUser = SEED_USERS.find((user) => user.role === 'author')
  if (!authorSeedUser) throw new Error('No author seed user defined')

  const authorId = userIdsByEmail[authorSeedUser.email]
  if (!authorId) throw new Error('Author user ID not resolved')

  // --- Seed posts ---
  for (const { title, content, author } of SEED_POSTS) {
    const existing = await prisma.post.findFirst({ where: { title } })
    if (existing) {
      console.log(`Post already exists (no change): "${title}"`)
    } else {
      const authorId = userIdsByEmail[author]
      if (!authorId) throw new Error(`Author user ID not resolved for ${author}`)
      await prisma.post.create({ data: { title, content, authorId } })
      console.log(`Created post: "${title}"`)
    }
  }

  await prisma.$disconnect()
  console.log('Seed complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
