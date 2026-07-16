'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CAR_MODELS } from '@/lib/maintenance-data'
import Link from 'next/link'

const CURRENT_YEAR = new Date().getFullYear()

export default function NewVehiclePage() {
  const [year, setYear] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [version, setVersion] = useState('')
  const [engine, setEngine] = useState('')
  const [km, setKm] = useState('')
  const [chassis, setChassis] = useState('')
  const [engineNumber, setEngineNumber] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Filtra modelos compatibles con el año ingresado
  const compatibleModels = useMemo(() => {
    const y = parseInt(year)
    if (!y || y < 1990 || y > CURRENT_YEAR) return CAR_MODELS
    return CAR_MODELS.filter(m => m.year_from <= y && (m.year_to === null || m.year_to >= y))
  }, [year])

  // Modelo seleccionado (o el primero compatible si no hay selección válida)
  const selectedModel = useMemo(() => {
    const found = compatibleModels.find(m => m.id === selectedModelId)
    return found ?? compatibleModels[0]
  }, [compatibleModels, selectedModelId])

  const handleYearChange = (val: string) => {
    setYear(val)
    setSelectedModelId('')
    setVersion('')
    setEngine('')
  }

  const handleModelChange = (id: string) => {
    setSelectedModelId(id)
    setVersion('')
    setEngine('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModel) return
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count && count >= 5) {
      setError('Ya tenés 5 autos registrados (límite máximo)')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('vehicles').insert({
      user_id: user.id,
      car_model_id: selectedModel.id,
      brand: selectedModel.brand,
      model: selectedModel.name,
      version: version || selectedModel.versions[0],
      engine: engine || selectedModel.engineOptions[0],
      year: parseInt(year),
      current_km: parseInt(km),
      chassis_number: chassis || null,
      engine_number: engineNumber || null,
      nickname: nickname || null,
    })

    if (insertError) {
      setError('Error al guardar el auto. Intentá de nuevo.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  const yearNum = parseInt(year)
  const yearValid = yearNum >= 1990 && yearNum <= CURRENT_YEAR

  return (
    <div className="min-h-screen" style={{ background: '#FDF0EB' }}>
      <header style={{ background: '#C97B5A' }} className="px-6 py-5 flex items-center gap-4">
        <Link href="/dashboard" style={{ color: '#F5DDD6' }} className="hover:text-white">← Volver</Link>
        <h1 className="text-white text-lg font-bold">Registrar auto</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PASO 1: Año — filtra los modelos */}
          <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
            <h2 className="font-bold mb-1" style={{ color: '#5C2A1E' }}>¿De qué año es tu auto?</h2>
            <p className="text-xs mb-4" style={{ color: '#C49080' }}>Esto nos permite mostrarte solo los modelos de esa época.</p>

            <input
              type="number"
              value={year}
              onChange={e => handleYearChange(e.target.value)}
              required
              min="1990"
              max={CURRENT_YEAR}
              placeholder={`Ej: 2021`}
              className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />

            {year && !yearValid && (
              <p className="text-xs mt-2" style={{ color: '#D94F3D' }}>
                Ingresá un año entre 1990 y {CURRENT_YEAR}
              </p>
            )}

            {yearValid && compatibleModels.length === 0 && (
              <p className="text-xs mt-2" style={{ color: '#E8B84B' }}>
                No tenemos datos para ese año todavía. Igual podés registrar el auto.
              </p>
            )}

            {yearValid && compatibleModels.length > 0 && (
              <p className="text-xs mt-2" style={{ color: '#7CB897' }}>
                ✓ {compatibleModels.length} modelo{compatibleModels.length > 1 ? 's' : ''} disponible{compatibleModels.length > 1 ? 's' : ''} para {year}
              </p>
            )}
          </div>

          {/* PASO 2: Modelo, versión, motor — solo si hay año válido */}
          {yearValid && selectedModel && (
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
              <h2 className="font-bold mb-4" style={{ color: '#5C2A1E' }}>¿Qué auto tenés?</h2>

              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Marca y modelo
              </label>
              <select
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none mb-4 transition-all"
                style={inputStyle}
                onChange={e => handleModelChange(e.target.value)}
                value={selectedModel.id}>
                {compatibleModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.emoji} {m.brand} {m.name} ({m.year_from}–{m.year_to ?? 'hoy'})
                  </option>
                ))}
              </select>

              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Versión
              </label>
              <select
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none mb-4 transition-all"
                style={inputStyle}
                value={version}
                onChange={e => setVersion(e.target.value)}>
                {selectedModel.versions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Motor
              </label>
              <select
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                style={inputStyle}
                value={engine}
                onChange={e => setEngine(e.target.value)}>
                {selectedModel.engineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}

          {/* PASO 3: KM */}
          {yearValid && selectedModel && (
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
              <h2 className="font-bold mb-1" style={{ color: '#5C2A1E' }}>¿Cuántos km tiene?</h2>
              <p className="text-xs mb-4" style={{ color: '#C49080' }}>Mirá el cuadro de instrumentos. Podés actualizarlo en cualquier momento.</p>
              <input
                type="number"
                value={km}
                onChange={e => setKm(e.target.value)}
                required
                min="0"
                placeholder="Ej: 45000"
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
              />
            </div>
          )}

          {/* Apodo opcional */}
          {yearValid && selectedModel && (
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Apodo <span style={{ fontWeight: 400 }}>(opcional)</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Ej: La Bestia, El Azul, La Nena..."
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
              />
            </div>
          )}

          {/* Datos técnicos opcionales */}
          {yearValid && selectedModel && (
            <details className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
              <summary className="cursor-pointer text-sm font-medium list-none flex items-center justify-between" style={{ color: '#C49080' }}>
                <span>Datos técnicos <span style={{ fontWeight: 400 }}>(chasis y motor — opcional)</span></span>
                <span>▼</span>
              </summary>
              <div className="mt-4 space-y-3">
                <p className="text-xs" style={{ color: '#C49080' }}>Útiles para repuestos y garantías. Están en la cédula verde.</p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>Número de Chasis / VIN</label>
                  <input
                    type="text"
                    value={chassis}
                    onChange={e => setChassis(e.target.value)}
                    placeholder="Figura en la cédula verde"
                    className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                    onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>Número de Motor</label>
                  <input
                    type="text"
                    value={engineNumber}
                    onChange={e => setEngineNumber(e.target.value)}
                    placeholder="Figura en la cédula verde"
                    className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                    onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                  />
                </div>
              </div>
            </details>
          )}

          {error && (
            <div className="text-sm px-4 py-3 rounded-2xl" style={{ background: '#FFF0EB', color: '#D94F3D' }}>
              {error}
            </div>
          )}

          {yearValid && selectedModel && (
            <button
              type="submit"
              disabled={loading || !km}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: '#C97B5A' }}>
              {loading ? 'Guardando...' : `Registrar mi ${selectedModel.brand} ${selectedModel.name}`}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
