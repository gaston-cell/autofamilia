'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdateKmForm({ vehicleId, currentKm }: { vehicleId: string; currentKm: number }) {
  const [newKm, setNewKm] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const km = parseInt(newKm)
    if (km <= currentKm) return alert('El nuevo kilometraje debe ser mayor al actual')
    setLoading(true)

    await supabase
      .from('vehicles')
      .update({ current_km: km, last_km_update: new Date().toISOString() })
      .eq('id', vehicleId)

    setLoading(false)
    setShow(false)
    setNewKm('')
    router.refresh()
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white"
        style={{ background: '#0ea5e9' }}>
        Actualizar kilometraje
      </button>
    )
  }

  return (
    <form onSubmit={handleUpdate} className="mt-4 flex gap-2 justify-center">
      <input
        type="number"
        value={newKm}
        onChange={e => setNewKm(e.target.value)}
        placeholder="Nuevo km"
        min={currentKm + 1}
        className="px-4 py-2 border-2 border-gray-200 rounded-xl text-center w-36 focus:outline-none focus:border-blue-400"
        autoFocus
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-xl font-bold text-white text-sm"
        style={{ background: '#10b981' }}>
        {loading ? '...' : 'Guardar'}
      </button>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="px-4 py-2 rounded-xl font-bold text-gray-500 text-sm border-2 border-gray-200">
        ✕
      </button>
    </form>
  )
}
