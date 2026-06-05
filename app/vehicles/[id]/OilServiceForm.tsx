'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OilServiceForm({ vehicleId, onCancel }: { vehicleId: string; onCancel?: () => void }) {
  const [km, setKm] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!km) return
    setLoading(true)

    await supabase
      .from('vehicles')
      .update({
        last_oil_change_km: parseInt(km),
        last_oil_change_date: date || null,
      })
      .eq('id', vehicleId)

    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          value={km}
          onChange={e => setKm(e.target.value)}
          placeholder="Km del último cambio"
          required
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 rounded-xl font-bold text-white text-sm"
          style={{ background: '#1e3a5f' }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl font-bold text-gray-500 text-sm border-2 border-gray-200">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
