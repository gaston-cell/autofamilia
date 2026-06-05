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

  // Recomendación de lavado según perfil
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
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold" style={{ color: '#1e3a5f' }}>🧽 Lavados</h2>
          <p className="text-xs text-gray-400">{washCount} lavados registrados</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Lavado */}
        <div className={`rounded-2xl p-4 border-2 ${washDue ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-gray-800">Lavado exterior</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {daysSinceWash === null
                  ? 'Sin registros aún'
                  : daysSinceWash === 0
                  ? 'Lavado hoy'
                  : `Hace ${daysSinceWash} días`}
              </p>
              {washDue && (
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  💧 Ya es momento de lavarlo
                </p>
              )}
            </div>
            <button
              onClick={() => registerWash('wash')}
              disabled={loading}
              className="text-sm font-bold text-white px-4 py-2 rounded-xl"
              style={{ background: '#0ea5e9' }}>
              Registrar
            </button>
          </div>
        </div>

        {/* Teflón */}
        <div className={`rounded-2xl p-4 border-2 ${teflonDue ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-gray-800">Lavado con teflón / cera</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {daysSinceTeflon === null
                  ? 'Sin registros aún'
                  : daysSinceTeflon === 0
                  ? 'Aplicado hoy'
                  : `Hace ${daysSinceTeflon} días`}
              </p>
              {teflonDue && (
                <p className="text-xs text-yellow-600 font-semibold mt-1">
                  ✨ Toca proteger la pintura
                </p>
              )}
              {!lastTeflonDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Recomendado cada {teflonFrequency / 30} meses
                </p>
              )}
            </div>
            <button
              onClick={() => registerWash('teflon')}
              disabled={loading}
              className="text-sm font-bold text-white px-4 py-2 rounded-xl"
              style={{ background: '#f59e0b' }}>
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
