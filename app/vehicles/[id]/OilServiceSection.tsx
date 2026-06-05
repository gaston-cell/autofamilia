'use client'

import { useState } from 'react'
import OilServiceForm from './OilServiceForm'

type Props = {
  vehicleId: string
  lastOilKm: number | null
  lastOilDate: string | null
  currentKm: number
}

export default function OilServiceSection({ vehicleId, lastOilKm, lastOilDate, currentKm }: Props) {
  const [editing, setEditing] = useState(false)

  const nextOilKm = lastOilKm ? lastOilKm + 10000 : null
  const kmOverdue = nextOilKm ? currentKm - nextOilKm : 0
  const oilOverdue = kmOverdue > 0
  const oilKmLeft = nextOilKm ? nextOilKm - currentKm : null
  const isCritical = kmOverdue > 5000

  if (!lastOilKm || editing) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-gray-100">
        <h2 className="font-bold mb-2" style={{ color: '#1e3a5f' }}>🛢️ Cambio de aceite y filtro</h2>
        <p className="text-sm text-gray-500 mb-3">
          {editing ? 'Actualizá el último cambio de aceite:' : '¿En qué kilometraje fue tu último cambio de aceite y filtro?'}
        </p>
        <OilServiceForm vehicleId={vehicleId} onCancel={editing ? () => setEditing(false) : undefined} />
      </div>
    )
  }

  if (isCritical) {
    return (
      <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-red-500">
        {/* Barra de emergencia */}
        <div className="bg-red-600 px-5 py-3 flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-white font-black text-base">ACEITE MUY VENCIDO</p>
            <p className="text-red-100 text-xs">Riesgo real de daño al motor</p>
          </div>
        </div>
        <div className="bg-red-50 p-5">
          <p className="text-red-800 font-bold text-lg mb-1">
            Pasado por {kmOverdue.toLocaleString()} km
          </p>
          <p className="text-red-600 text-sm mb-4">
            Último cambio a los {lastOilKm.toLocaleString()} km
            {lastOilDate && ` · ${new Date(lastOilDate).toLocaleDateString('es-AR')}`}.
            Circular más tiempo sin cambiarlo puede dañar el motor permanentemente.
          </p>
          <div className="bg-red-100 border border-red-300 rounded-2xl p-3 mb-4">
            <p className="text-red-700 text-sm font-semibold">⚡ Qué hacer ahora:</p>
            <p className="text-red-600 text-sm mt-1">Llevá el auto a un lubricentro hoy o mañana. No esperes al próximo service.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-3 rounded-2xl font-bold text-white text-sm bg-red-600">
              Ya lo cambié — registrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (oilOverdue) {
    return (
      <div className="rounded-3xl overflow-hidden shadow-md border-2 border-orange-400">
        <div className="bg-orange-500 px-5 py-3 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-white font-black text-base">CAMBIO DE ACEITE VENCIDO</p>
            <p className="text-orange-100 text-xs">Hacelo lo antes posible</p>
          </div>
        </div>
        <div className="bg-orange-50 p-5">
          <p className="text-orange-800 font-bold text-lg mb-1">
            Pasado por {kmOverdue.toLocaleString()} km
          </p>
          <p className="text-orange-700 text-sm mb-4">
            Último cambio a los {lastOilKm.toLocaleString()} km
            {lastOilDate && ` · ${new Date(lastOilDate).toLocaleDateString('es-AR')}`}.
            El aceite viejo desgasta el motor más rápido.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-3 rounded-2xl font-bold text-white text-sm bg-orange-500">
              Ya lo cambié — registrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Todo bien
  const pct = Math.min(((10000 - oilKmLeft!) / 10000) * 100, 100)
  const barColor = oilKmLeft! < 1000 ? '#f59e0b' : '#10b981'

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-gray-100">
      <h2 className="font-bold mb-3" style={{ color: '#1e3a5f' }}>🛢️ Cambio de aceite y filtro</h2>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Último: {lastOilKm.toLocaleString()} km</span>
        <span style={{ color: barColor }}>Próximo: {nextOilKm!.toLocaleString()} km</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
        <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: barColor }}>
        {oilKmLeft! < 1000
          ? `⚡ Quedan solo ${oilKmLeft!.toLocaleString()} km — agendalo ya`
          : `✅ Quedan ${oilKmLeft!.toLocaleString()} km para el próximo cambio`}
      </p>
      <button onClick={() => setEditing(true)} className="mt-2 text-xs text-blue-500 underline">
        Actualizar último cambio
      </button>
    </div>
  )
}
