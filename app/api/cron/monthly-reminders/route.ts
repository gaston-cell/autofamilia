import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { kmReminderEmail, maintenanceAlertEmail, insuranceExpiryEmail } from '@/lib/email-templates'
import { getMaintenanceUpToKm } from '@/lib/maintenance-data'

const resend = new Resend(process.env.RESEND_API_KEY)

// Supabase admin client (bypasses RLS para leer todos los usuarios)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  // Verificar que la llamada viene de un cron autorizado
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { sent: 0, errors: 0, skipped: 0 }

  try {
    // Obtener todos los usuarios con sus vehículos
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, full_name')

    if (!profiles?.length) {
      return NextResponse.json({ message: 'No users found', results })
    }

    for (const profile of profiles) {
      try {
        // Obtener email del usuario
        const { data: { user } } = await supabase.auth.admin.getUserById(profile.id)
        if (!user?.email) { results.skipped++; continue }

        const userName = profile.full_name || user.email.split('@')[0]

        // Obtener vehículos del usuario
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('*, maintenance_logs(*)')
          .eq('user_id', profile.id)

        if (!vehicles?.length) { results.skipped++; continue }

        // 1. EMAIL DE RECORDATORIO MENSUAL DE KM
        const kmEmail = kmReminderEmail(userName, vehicles)
        await resend.emails.send({
          from: 'AutoFamilia <notificaciones@autofamilia.app>',
          to: user.email,
          subject: kmEmail.subject,
          html: kmEmail.html,
        })
        results.sent++

        // 2. ALERTAS DE MANTENIMIENTO PENDIENTE
        for (const vehicle of vehicles) {
          const completedKms: number[] = vehicle.maintenance_logs?.map((l: { task_km: number }) => l.task_km) || []
          const pastTasks = getMaintenanceUpToKm(vehicle.car_model_id, vehicle.current_km)
          const pendingTasks = pastTasks.filter(t => !completedKms.includes(t.km))

          if (pendingTasks.length > 0) {
            const alertEmail = maintenanceAlertEmail(userName, vehicle, pendingTasks)
            await resend.emails.send({
              from: 'AutoFamilia <notificaciones@autofamilia.app>',
              to: user.email,
              subject: alertEmail.subject,
              html: alertEmail.html,
            })
            results.sent++
          }

          // 3. ALERTA DE SEGURO POR VENCER
          if (vehicle.insurance_expiry) {
            const expiry = new Date(vehicle.insurance_expiry)
            const today = new Date()
            const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            // Avisar si vence en 30 días o menos, o ya venció
            if (daysLeft <= 30) {
              const insEmail = insuranceExpiryEmail(
                userName,
                vehicle,
                daysLeft,
                vehicle.insurance_company || 'tu aseguradora'
              )
              await resend.emails.send({
                from: 'AutoFamilia <notificaciones@autofamilia.app>',
                to: user.email,
                subject: insEmail.subject,
                html: insEmail.html,
              })
              results.sent++
            }
          }
        }
      } catch (userError) {
        console.error(`Error processing user ${profile.id}:`, userError)
        results.errors++
      }
    }

    return NextResponse.json({ message: 'Cron completado', results })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: 'Error en cron', results }, { status: 500 })
  }
}
