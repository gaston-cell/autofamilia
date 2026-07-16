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

  const sql = `
    ALTER TABLE vehicles
      ADD COLUMN IF NOT EXISTS battery_installed_date date,
      ADD COLUMN IF NOT EXISTS battery_brand text;
  `

  const { error } = await supabase.rpc('exec_sql', { sql })

  if (error) {
    // If exec_sql not available, try direct approach via REST
    return NextResponse.json({ error: error.message, hint: 'Run SQL manually in Supabase dashboard' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'Battery columns added' })
}
