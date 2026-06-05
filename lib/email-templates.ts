export function kmReminderEmail(name: string, vehicles: { brand: string; model: string; current_km: number }[]) {
  const vehicleList = vehicles
    .map(v => `<li><strong>${v.brand} ${v.model}</strong> — ${v.current_km.toLocaleString()} km</li>`)
    .join('')

  return {
    subject: `${name}, ¿cuántos km tiene tu auto este mes? 🚗`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #0ea5e9); padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px; margin-bottom: 8px;">🚗</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">AutoFamilia</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Tu auto al día, tu familia segura</p>
        </div>

        <h2 style="color: #1e3a5f;">Hola ${name} 👋</h2>
        <p style="color: #64748b;">Ya pasó un mes. Actualizá el kilometraje de tu auto para que podamos avisarte si hay algo que revisar.</p>

        <div style="background: #f0f4f8; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-weight: bold; color: #1e3a5f;">Tus autos:</p>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            ${vehicleList}
          </ul>
        </div>

        <a href="https://autofamilia.app/dashboard"
          style="display: block; background: #1e3a5f; color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Actualizar kilometraje →
        </a>

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          AutoFamilia · Tu guía de mantenimiento familiar
        </p>
      </div>
    `
  }
}

export function maintenanceAlertEmail(
  name: string,
  vehicle: { brand: string; model: string; current_km: number },
  tasks: { task: string; description: string; km: number; severity: string }[]
) {
  const urgent = tasks.filter(t => t.severity === 'critical')
  const normal = tasks.filter(t => t.severity !== 'critical')

  const taskRows = (list: typeof tasks, color: string) =>
    list.map(t => `
      <div style="border-left: 4px solid ${color}; padding: 12px 16px; margin: 8px 0; background: white; border-radius: 0 12px 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #1e3a5f;">${t.task}</p>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">${t.description}</p>
        <p style="margin: 4px 0 0; color: ${color}; font-size: 12px; font-weight: bold;">A los ${t.km.toLocaleString()} km</p>
      </div>
    `).join('')

  return {
    subject: `⚠️ Tu ${vehicle.brand} ${vehicle.model} necesita atención`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #0ea5e9); padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px; margin-bottom: 8px;">🚗</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">AutoFamilia</h1>
        </div>

        <h2 style="color: #1e3a5f;">Hola ${name} 👋</h2>
        <p style="color: #64748b;">Tu <strong>${vehicle.brand} ${vehicle.model}</strong> llegó a <strong>${vehicle.current_km.toLocaleString()} km</strong> y tiene mantenimientos pendientes.</p>

        ${urgent.length > 0 ? `
          <h3 style="color: #ef4444;">🔴 Urgente</h3>
          ${taskRows(urgent, '#ef4444')}
        ` : ''}

        ${normal.length > 0 ? `
          <h3 style="color: #f59e0b;">⚠️ Pendiente</h3>
          ${taskRows(normal, '#f59e0b')}
        ` : ''}

        <a href="https://autofamilia.app/dashboard"
          style="display: block; background: #1e3a5f; color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Ver estado del auto →
        </a>

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          AutoFamilia · Tu guía de mantenimiento familiar
        </p>
      </div>
    `
  }
}

export function insuranceExpiryEmail(
  name: string,
  vehicle: { brand: string; model: string },
  daysLeft: number,
  company: string
) {
  const urgency = daysLeft <= 0 ? 'VENCIDO' : daysLeft <= 15 ? `Vence en ${daysLeft} días` : `Vence en ${daysLeft} días`
  const color = daysLeft <= 0 ? '#ef4444' : daysLeft <= 15 ? '#f97316' : '#f59e0b'

  return {
    subject: `🛡️ El seguro de tu ${vehicle.brand} ${vehicle.model} ${daysLeft <= 0 ? 'venció' : 'está por vencer'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #0ea5e9); padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px; margin-bottom: 8px;">🛡️</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">AutoFamilia</h1>
        </div>

        <h2 style="color: #1e3a5f;">Hola ${name} 👋</h2>

        <div style="background: ${color}15; border: 2px solid ${color}; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="color: ${color}; font-weight: bold; font-size: 20px; margin: 0;">${urgency}</p>
          <p style="color: #475569; margin: 8px 0 0;">Seguro de ${company} — ${vehicle.brand} ${vehicle.model}</p>
        </div>

        <p style="color: #64748b;">Renovar el seguro a tiempo evita circular en infracción y protege a tu familia ante cualquier imprevisto.</p>

        <a href="https://autofamilia.app/dashboard"
          style="display: block; background: ${color}; color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Ver detalles del seguro →
        </a>

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          AutoFamilia · Tu guía de mantenimiento familiar
        </p>
      </div>
    `
  }
}
