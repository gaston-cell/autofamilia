'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CAR_MODELS } from '@/lib/maintenance-data'
import Link from 'next/link'

export default function NewVehiclePage() {
  const [selectedModel, setSelectedModel] = useState(CAR_MODELS[0])
  const [version, setVersion] = useState('')
  const [engine, setEngine] = useState('')
  const [year, setYear] = useState('')
  const [km, setKm] = useState('')
  const [chassis, setChassis] = useState('')
  const [engineNumber, setEngineNumber] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <header style={{ background: '#C97B5A' }} className="px-6 py-5 flex items-center gap-4">
        <Link href="/dashboard" className="text-blue-200 hover:text-white">← Volver</Link>
        <h1 className="text-white text-lg font-bold">Registrar auto</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Marca y Modelo */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold mb-4" style={{ color: '#C97B5A' }}>Datos del vehículo</h2>

            <label className="block text-sm font-medium text-gray-600 mb-1">Marca y Modelo</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-blue-400"
              onChange={e => {
                const model = CAR_MODELS.find(m => m.id === e.target.value)!
                setSelectedModel(model)
                setVersion('')
                setEngine('')
              }}
              value={selectedModel.id}>
              {CAR_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.brand} {m.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-600 mb-1">Versión</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-blue-400"
              value={version}
              onChange={e => setVersion(e.target.value)}>
              {selectedModel.versions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <label className="block text-sm font-medium text-gray-600 mb-1">Motor</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-blue-400"
              value={engine}
              onChange={e => setEngine(e.target.value)}>
              {selectedModel.engineOptions.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Año</label>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  required
                  min="1990"
                  max="2026"
                  placeholder="2022"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Kilometraje actual</label>
                <input
                  type="number"
                  value={km}
                  onChange={e => setKm(e.target.value)}
                  required
                  min="0"
                  placeholder="45000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Apodo opcional */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Apodo del auto <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="Ej: La Bestia, El Azul..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Datos técnicos opcionales colapsados */}
          <details className="bg-white rounded-3xl p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-gray-600 list-none flex items-center justify-between">
              <span>Datos técnicos avanzados (opcional)</span>
              <span>▼</span>
            </summary>
            <div className="mt-4 space-y-3">
              <p className="text-xs text-gray-400">Útiles para repuestos y garantías. Podés completarlos después.</p>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Número de Chasis / VIN</label>
                <input
                  type="text"
                  value={chassis}
                  onChange={e => setChassis(e.target.value)}
                  placeholder="Figura en la cédula verde"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Número de Motor</label>
                <input
                  type="text"
                  value={engineNumber}
                  onChange={e => setEngineNumber(e.target.value)}
                  placeholder="Figura en la cédula verde"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </details>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: '#C97B5A' }}>
            {loading ? 'Guardando...' : 'Registrar auto'}
          </button>
        </form>
      </div>
    </div>
  )
}
