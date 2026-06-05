'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  vehicleId: string
  sleepsIn: string | null
  zone: string | null
  usageType: string | null
}

const SLEEPS_OPTIONS = [
  { value: 'garage', label: '🏠 Garage cubierto', tip: 'Protegido del clima' },
  { value: 'calle', label: '🌧️ En la calle', tip: 'Más exposición, más cuidado' },
  { value: 'descubierto', label: '🏢 Descubierto privado', tip: 'Playa de estacionamiento' },
]

const ZONE_OPTIONS = [
  { value: 'urbana', label: '🏙️ Ciudad', tip: 'Mucho arranque y frenada' },
  { value: 'costera', label: '🌊 Zona costera', tip: 'Sal y humedad aceleran el óxido' },
  { value: 'ruta', label: '🛣️ Zona de ruta', tip: 'Más km, menos desgaste urbano' },
  { value: 'mixta', label: '🗺️ Mixta', tip: 'Ciudad + viajes frecuentes' },
]

const USAGE_OPTIONS = [
  { value: 'ciudad', label: '🚦 Solo ciudad', tip: 'Trayectos cortos y frecuentes' },
  { value: 'ruta', label: '🛣️ Mayormente ruta', tip: 'Viajes largos, menos frenadas' },
  { value: 'mixto', label: '🔄 Mixto', tip: 'Ciudad y ruta por igual' },
  { value: 'trabajo', label: '⚒️ Uso laboral', tip: 'Alta exigencia diaria' },
]

export default function VehicleProfileSection({ vehicleId, sleepsIn, zone, usageType }: Props) {
  const [currentSleeps, setCurrentSleeps] = useState(sleepsIn || 'garage')
  const [currentZone, setCurrentZone] = useState(zone || 'urbana')
  const [currentUsage, setCurrentUsage] = useState(usageType || 'mixto')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(!sleepsIn)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    await supabase
      .from('vehicles')
      .update({
        sleeps_in: currentSleeps,
        zone: currentZone,
        usage_type: currentUsage,
      })
      .eq('id', vehicleId)

    setLoading(false)
    setSaved(true)
    setOpen(false)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  const sleepsLabel = SLEEPS_OPTIONS.find(o => o.value === currentSleeps)?.label
  const zoneLabel = ZONE_OPTIONS.find(o => o.value === currentZone)?.label
  const usageLabel = USAGE_OPTIONS.find(o => o.value === currentUsage)?.label

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between">
        <div className="text-left">
          <h2 className="font-bold" style={{ color: '#1e3a5f' }}>🚗 Perfil del auto</h2>
          {!open && (
            <p className="text-xs text-gray-400 mt-0.5">
              {sleepsLabel} · {zoneLabel} · {usageLabel}
            </p>
          )}
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-5">

          {/* ¿Dónde duerme? */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              ¿Dónde duerme el auto?
            </label>
            <div className="space-y-2">
              {SLEEPS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCurrentSleeps(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                    currentSleeps === opt.value
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}>
                  <span className="font-medium text-sm">{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.tip}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zona */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              ¿En qué zona vivís?
            </label>
            <div className="space-y-2">
              {ZONE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCurrentZone(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                    currentZone === opt.value
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}>
                  <span className="font-medium text-sm">{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.tip}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Uso */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              ¿Cómo usás el auto principalmente?
            </label>
            <div className="space-y-2">
              {USAGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCurrentUsage(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                    currentUsage === opt.value
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}>
                  <span className="font-medium text-sm">{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.tip}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white transition-all"
            style={{ background: saved ? '#10b981' : '#1e3a5f' }}>
            {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar perfil'}
          </button>
        </div>
      )}
    </div>
  )
}
