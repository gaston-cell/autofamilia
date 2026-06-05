import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'AutoFamilia <notificaciones@autofamilia.app>',
      to,
      subject,
      html,
    })

    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Error enviando email' }, { status: 500 })
  }
}
