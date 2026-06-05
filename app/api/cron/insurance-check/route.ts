import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { insuranceExpiryEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { sent: 0, skipped: 0, errors: 0 }
  const today = new Date()

  try {
    // Obtener todos los vehículos con seguro cargado
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id, user_id, brand, model, insurance_company, insurance_expiry')
      .not('insurance_expiry', 'is', null)

    if (!vehicles?.length) {
      return NextResponse.json({ message: 'No vehicles with insurance', results })
    }

    for (const vehicle of vehicles) {
      try {
        const expiry = new Date(vehicle.insurance_expiry)
        const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        // Solo avisar en días clave: 30, 15, 7, 1, 0 (vencido)
        const alertDays = [30, 15, 7, 1, 0]
        if (!alertDays.includes(daysLeft)) { results.skipped++; continue }

        // Obtener usuario
        const { data: { user } } = await supabase.auth.admin.getUserById(vehicle.user_id)
        if (!user?.email) { results.skipped++; continue }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', vehicle.user_id)
          .single()

        const userName = profile?.full_name || user.email.split('@')[0]

        const email = insuranceExpiryEmail(
          userName,
          vehicle,
          daysLeft,
          vehicle.insurance_company || 'tu aseguradora'
        )

        await resend.emails.send({
          from: 'AutoFamilia <notificaciones@autofamilia.app>',
          to: user.email,
          subject: email.subject,
          html: email.html,
        })

        results.sent++
      } catch (err) {
        results.errors++
      }
    }

    return NextResponse.json({ message: 'Insurance check completado', results })
  } catch (error) {
    return NextResponse.json({ error: 'Error en cron', results }, { status: 500 })
  }
}
