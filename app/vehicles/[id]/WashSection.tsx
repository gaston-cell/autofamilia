'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  vehicleId: string
  lastWashDate: string | null
  lastTeflonDate: string | null
  washCount: number
  sleepsIn: string | null
}

export default function WashSection({ vehicleId, lastWashDate, lastTeflonDate, washCount, sleepsIn }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const daysSinceWash = lastWashDate
    ? Math.floor((new Date().getTime() - new Date(lastWashDate).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const daysSinceTeflon = lastTeflonDate
    ? Math.floor((new Date().getTime() - new Date(lastTeflonDate).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const washFrequency = sleepsIn === 'calle' ? 14 : 21
  const teflonFrequency = sleepsIn === 'costera' ? 90 : 180

  const washDue = daysSinceWash !== null && daysSinceWash >= washFrequency
  const teflonDue = daysSinceTeflon !== null && daysSinceTeflon >= teflonFrequency

  const registerWash = async (type: 'wash' | 'teflon') => {
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]
    const updates: Record<string, string | number> = {}

    if (type === 'wash') {
      updates.last_wash_date = today
      updates.wash_count = washCount + 1
    } else {
      updates.last_teflon_date = today
      updates.last_wash_date = today
      updates.wash_count = washCount + 1
    }

    await supabase.from('vehicles').update(updates).eq('id', vehicleId)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold" style={{ color: '#5C2A1E' }}>🧽 Lavados</h2>
          <p className="text-xs" style={{ color: '#C49080' }}>{washCount} lavados registrados</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Lavado */}
        <div className="rounded-2xl p-4" style={{
          background: washDue ? '#FFF0EB' : '#FFF5F2',
          border: `1.5px solid ${washDue ? '#E8B4A0' : '#F5DDD6'}`,
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm" style={{ color: '#3D1810' }}>Lavado exterior</p>
              <p className="text-xs mt-0.5" style={{ color: '#C49080' }}>
                {daysSinceWash === null
                  ? 'Sin registros aún'
                  : daysSinceWash === 0
                  ? 'Lavado hoy'
                  : `Hace ${daysSinceWash} días`}
              </p>
              {washDue && (
                <p className="text-xs font-semibold mt-1" style={{ color: '#C97B5A' }}>
                  💧 Ya es momento de lavarlo
                </p>
              )}
            </div>
            <button
              onClick={() => registerWash('wash')}
              disabled={loading}
              className="text-sm font-bold text-white px-4 py-2 rounded-xl"
              style={{ background: '#C97B5A' }}>
              Registrar
            </button>
          </div>
        </div>

        {/* Teflón */}
        <div className="rounded-2xl p-4" style={{
          background: teflonDue ? '#FFFBF0' : '#FFF5F2',
          border: `1.5px solid ${teflonDue ? '#E8B84B' : '#F5DDD6'}`,
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm" style={{ color: '#3D1810' }}>Lavado con teflón / cera</p>
              <p className="text-xs mt-0.5" style={{ color: '#C49080' }}>
                {daysSinceTeflon === null
                  ? 'Sin registros aún'
                  : daysSinceTeflon === 0
                  ? 'Aplicado hoy'
                  : `Hace ${daysSinceTeflon} días`}
              </p>
              {teflonDue && (
                <p className="text-xs font-semibold mt-1" style={{ color: '#8B6800' }}>
                  ✨ Toca proteger la pintura
                </p>
              )}
              {!lastTeflonDate && (
                <p className="text-xs mt-1" style={{ color: '#C49080' }}>
                  Recomendado cada {teflonFrequency / 30} meses
                </p>
              )}
            </div>
            <button
              onClick={() => registerWash('teflon')}
              disabled={loading}
              className="text-sm font-bold text-white px-4 py-2 rounded-xl"
              style={{ background: '#E8B84B' }}>
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
