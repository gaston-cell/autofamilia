'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  vehicleId: string
  batteryInstalledDate: string | null
  batteryBrand: string | null
}

export default function BatterySection({ vehicleId, batteryInstalledDate, batteryBrand }: Props) {
  const [open, setOpen] = useState(!batteryInstalledDate)
  const [installedDate, setInstalledDate] = useState(batteryInstalledDate || '')
  const [brand, setBrand] = useState(batteryBrand || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const ageYears = batteryInstalledDate
    ? (new Date().getTime() - new Date(batteryInstalledDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
    : null

  const ageMonths = ageYears !== null ? Math.floor(ageYears * 12) : null
  const isCritical = ageYears !== null && ageYears >= 4
  const isWarning = ageYears !== null && ageYears >= 3 && ageYears < 4
  const isOk = ageYears !== null && ageYears < 3

  const handleSave = async () => {
    setLoading(true)
    await supabase.from('vehicles').update({
      battery_installed_date: installedDate || null,
      battery_brand: brand || null,
    }).eq('id', vehicleId)
    setLoading(false)
    setSaved(true)
    setOpen(false)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  const cardBg = isCritical ? '#FFF0EB' : isWarning ? '#FFFBF0' : 'white'
  const cardBorder = isCritical ? '#D94F3D' : isWarning ? '#E8B84B' : '#F5DDD6'

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  return (
    <div className="rounded-3xl p-5 shadow-sm" style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <div className="text-left">
          <h2 className="font-bold" style={{ color: isCritical ? '#D94F3D' : '#5C2A1E' }}>🔋 Batería</h2>
          {!open && batteryInstalledDate && (
            <p className="text-xs mt-0.5" style={{ color: '#C49080' }}>
              {batteryBrand ? `${batteryBrand} · ` : ''}{ageMonths! < 12 ? `${ageMonths} meses` : `${Math.floor(ageYears!)} años`} de uso
            </p>
          )}
        </div>
        <span className="text-sm" style={{ color: '#C49080' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Estado cuando está cerrado */}
      {!open && ageYears !== null && (
        <div className="mt-3">
          {/* Barra de vida */}
          <div className="flex justify-between text-xs mb-1" style={{ color: '#C49080' }}>
            <span>Instalada hace {ageMonths! < 12 ? `${ageMonths} meses` : `${Math.floor(ageYears!)} años`}</span>
            <span style={{ color: isCritical ? '#D94F3D' : isWarning ? '#8B6800' : '#7CB897' }}>
              vida útil: 3-5 años
            </span>
          </div>
          <div className="w-full rounded-full h-2.5 mb-3" style={{ background: '#F5DDD6' }}>
            <div className="h-2.5 rounded-full transition-all"
              style={{
                width: `${Math.min((ageYears / 4.5) * 100, 100)}%`,
                background: isCritical ? '#D94F3D' : isWarning ? '#E8B84B' : '#7CB897',
              }} />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{
              background: isCritical ? '#FFF0EB' : isWarning ? '#FFFBF0' : '#F0FBF5',
              color: isCritical ? '#D94F3D' : isWarning ? '#8B6800' : '#4A9B6E',
            }}>
            {isCritical
              ? `🔴 Batería con ${Math.floor(ageYears!)} años — revisala antes de que falle`
              : isWarning
              ? `🟡 Batería con ${Math.floor(ageYears!)} años — empezá a planificar el cambio`
              : `✅ Batería en buen estado`}
          </div>

          {isCritical && (
            <p className="text-xs mt-2" style={{ color: '#A07060' }}>
              Las baterías suelen durar 3 a 5 años. Una falla inesperada puede dejarte varada. Pedile a tu mecánico que la evalúe en el próximo service.
            </p>
          )}
        </div>
      )}

      {open && (
        <div className="mt-4 space-y-4">
          <p className="text-sm" style={{ color: '#A07060' }}>
            Registrá cuándo instalaste la batería actual para que te avisemos cuando esté próxima a vencer (vida útil promedio: 3-5 años).
          </p>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Fecha de instalación
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

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Marca <span style={{ fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="Ej: Moura, Bosch, Willard..."
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading || !installedDate}
            className="w-full py-3 rounded-2xl font-bold text-white disabled:opacity-50"
            style={{ background: saved ? '#7CB897' : '#C97B5A' }}>
            {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar datos de batería'}
          </button>
        </div>
      )}
    </div>
  )
}
