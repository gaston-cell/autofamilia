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

  const wearColor = tireWearPct > 80 ? '#D94F3D' : tireWearPct > 60 ? '#E8B84B' : '#7CB897'

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <div className="text-left">
          <h2 className="font-bold" style={{ color: '#5C2A1E' }}>🛞 Neumáticos</h2>
          {!open && tiresKm && (
            <p className="text-xs mt-0.5" style={{ color: '#C49080' }}>
              {kmOnTires?.toLocaleString()} km de uso · {tireWearPct.toFixed(0)}% de vida útil
            </p>
          )}
        </div>
        <span className="text-sm" style={{ color: '#C49080' }}>{open ? '▲' : '▼'}</span>
      </button>

      {!open && tiresKm && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: '#C49080' }}>
              <span>Desgaste estimado</span>
              <span style={{ color: wearColor }}>{kmOnTires?.toLocaleString()} / 50.000 km</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ background: '#F5DDD6' }}>
              <div className="h-2.5 rounded-full transition-all" style={{ width: `${tireWearPct}%`, background: wearColor }} />
            </div>
          </div>

          {dotAge !== null && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{
                background: dotDanger ? '#FFF0EB' : dotWarning ? '#FFFBF0' : '#F0FBF5',
                color: dotDanger ? '#D94F3D' : dotWarning ? '#8B6800' : '#4A9B6E',
              }}>
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
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              ¿En qué km instalaste los neumáticos?
            </label>
            <input
              type="number"
              value={km}
              onChange={e => setKm(e.target.value)}
              placeholder="Ej: 80000"
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
            {km && (
              <p className="text-xs mt-1" style={{ color: '#C49080' }}>
                Llevan {(currentKm - parseInt(km)).toLocaleString()} km de uso
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Código DOT <span style={{ fontWeight: 400 }}>(últimos 4 dígitos del lateral)</span>
            </label>
            <input
              type="text"
              value={dot}
              onChange={e => setDot(e.target.value)}
              placeholder="Ej: 2423 (semana 24, año 2023)"
              maxLength={10}
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
            <p className="text-xs mt-1" style={{ color: '#C49080' }}>
              El DOT está en relieve en el lateral. Te dice cuándo fueron fabricados.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Fecha de instalación <span style={{ fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="date"
              value={installedDate}
              onChange={e => setInstalledDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white"
            style={{ background: saved ? '#7CB897' : '#C97B5A' }}>
            {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar datos de neumáticos'}
          </button>
        </div>
      )}
    </div>
  )
}
