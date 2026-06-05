'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  vehicleId: string
  tiresKm: number | null
  tiresDot: string | null
  tiresInstalledDate: string | null
  currentKm: number
}

export default function TiresSection({ vehicleId, tiresKm, tiresDot, tiresInstalledDate, currentKm }: Props) {
  const [open, setOpen] = useState(!tiresKm)
  const [km, setKm] = useState(tiresKm?.toString() || '')
  const [dot, setDot] = useState(tiresDot || '')
  const [installedDate, setInstalledDate] = useState(tiresInstalledDate || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const kmOnTires = tiresKm ? currentKm - tiresKm : null
  const tireWearPct = kmOnTires ? Math.min((kmOnTires / 50000) * 100, 100) : 0

  // DOT: últimos 4 dígitos = semana + año (ej: 2423 = semana 24 de 2023)
  const dotAge = tiresDot && tiresDot.length >= 4 ? (() => {
    const week = parseInt(tiresDot.slice(-4, -2))
    const year = parseInt('20' + tiresDot.slice(-2))
    const manufactured = new Date(year, 0, week * 7)
    const years = (new Date().getTime() - manufactured.getTime()) / (1000 * 60 * 60 * 24 * 365)
    return Math.floor(years)
  })() : null

  const dotWarning = dotAge !== null && dotAge >= 5
  const dotDanger = dotAge !== null && dotAge >= 7

  const handleSave = async () => {
    setLoading(true)
    await supabase
      .from('vehicles')
      .update({
        tires_km: km ? parseInt(km) : null,
        tires_dot: dot || null,
        tires_installed_date: installedDate || null,
      })
      .eq('id', vehicleId)
    setLoading(false)
    setSaved(true)
    setOpen(false)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  const wearColor = tireWearPct > 80 ? '#ef4444' : tireWearPct > 60 ? '#f59e0b' : '#10b981'

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <div className="text-left">
          <h2 className="font-bold" style={{ color: '#1e3a5f' }}>🛞 Neumáticos</h2>
          {!open && tiresKm && (
            <p className="text-xs text-gray-400 mt-0.5">
              {kmOnTires?.toLocaleString()} km de uso · {tireWearPct.toFixed(0)}% de vida útil
            </p>
          )}
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {/* Resumen cuando está cerrado */}
      {!open && tiresKm && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Desgaste estimado</span>
              <span style={{ color: wearColor }}>{kmOnTires?.toLocaleString()} / 50,000 km</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="h-3 rounded-full transition-all" style={{ width: `${tireWearPct}%`, background: wearColor }} />
            </div>
          </div>

          {dotAge !== null && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
              dotDanger ? 'bg-red-50 text-red-700' : dotWarning ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
            }`}>
              {dotDanger ? '🔴' : dotWarning ? '🟡' : '✅'}
              <span className="font-medium">
                {dotDanger
                  ? `Neumáticos con ${dotAge} años — cambio urgente recomendado`
                  : dotWarning
                  ? `Neumáticos con ${dotAge} años — empezá a planificar el cambio`
                  : `Neumáticos con ${dotAge} años — en buen estado`}
              </span>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              ¿En qué km instalaste los neumáticos actuales?
            </label>
            <input
              type="number"
              value={km}
              onChange={e => setKm(e.target.value)}
              placeholder="Ej: 80000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
            {km && (
              <p className="text-xs text-gray-400 mt-1">
                Llevan {(currentKm - parseInt(km)).toLocaleString()} km de uso
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Código DOT <span className="text-gray-400 font-normal">(últimos 4 dígitos del lateral del neumático)</span>
            </label>
            <input
              type="text"
              value={dot}
              onChange={e => setDot(e.target.value)}
              placeholder="Ej: 2423 (semana 24, año 2023)"
              maxLength={10}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              El DOT está en relieve en el lateral. Te dice cuándo fueron fabricados.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Fecha de instalación <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="date"
              value={installedDate}
              onChange={e => setInstalledDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white"
            style={{ background: saved ? '#10b981' : '#1e3a5f' }}>
            {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar datos de neumáticos'}
          </button>
        </div>
      )}
    </div>
  )
}
