import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { kmReminderEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

// Ruta de prueba — solo para verificar que los emails llegan
// Llamar con: GET /api/test-email?secret=autofamilia_cron_2026&to=tu@email.com

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const to = searchParams.get('to')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!to) {
    return NextResponse.json({ error: 'Falta ?to=email' }, { status: 400 })
  }

  const email = kmReminderEmail('Gastón', [
    { brand: 'Ford', model: 'Ranger', current_km: 85000 }
  ])

  const { data, error } = await resend.emails.send({
    from: 'AutoFamilia <onboarding@resend.dev>',
    to,
    subject: email.subject,
    html: email.html,
  })

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true, data })
}
