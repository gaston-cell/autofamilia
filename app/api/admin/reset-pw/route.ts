import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users?.find(u => u.email === 'gastonjrubin@gmail.com')

  if (!user) {
    const emails = users?.users?.map(u => u.email)
    return NextResponse.json({ error: 'User not found', registered_emails: emails }, { status: 404 })
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: 'Autofamilia'
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: `Password reset for ${user.email}` })
}
