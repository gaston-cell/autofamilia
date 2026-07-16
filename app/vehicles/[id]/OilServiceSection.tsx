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
      <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
        <h2 className="font-bold mb-2" style={{ color: '#5C2A1E' }}>🛢️ Cambio de aceite y filtro</h2>
        <p className="text-sm mb-3" style={{ color: '#A07060' }}>
          {editing ? 'Actualizá el último cambio de aceite:' : '¿En qué kilometraje fue tu último cambio de aceite y filtro?'}
        </p>
        <OilServiceForm vehicleId={vehicleId} onCancel={editing ? () => setEditing(false) : undefined} />
      </div>
    )
  }

  if (isCritical) {
    return (
      <div className="rounded-3xl overflow-hidden shadow-lg" style={{ border: '2px solid #D94F3D' }}>
        <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#D94F3D' }}>
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-white font-black text-base">Aceite muy vencido</p>
            <p className="text-xs" style={{ color: '#FFD5CC' }}>Riesgo real de daño al motor</p>
          </div>
        </div>
        <div className="p-5" style={{ background: '#FFF5F2' }}>
          <p className="font-bold text-lg mb-1" style={{ color: '#D94F3D' }}>
            Pasado por {kmOverdue.toLocaleString()} km
          </p>
          <p className="text-sm mb-4" style={{ color: '#8B4A36' }}>
            Último cambio a los {lastOilKm.toLocaleString()} km
            {lastOilDate && ` · ${new Date(lastOilDate).toLocaleDateString('es-AR')}`}.
            Circular más sin cambiarlo puede dañar el motor permanentemente.
          </p>
          <div className="rounded-2xl p-3 mb-4" style={{ background: '#FFF0EB', border: '1px solid #F5DDD6' }}>
            <p className="text-sm font-semibold" style={{ color: '#8B4A36' }}>⚡ Qué hacer ahora:</p>
            <p className="text-sm mt-1" style={{ color: '#A07060' }}>Llevá el auto a un lubricentro hoy o mañana. No esperes al próximo service.</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="w-full py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: '#D94F3D' }}>
            Ya lo cambié — registrar
          </button>
        </div>
      </div>
    )
  }

  if (oilOverdue) {
    return (
      <div className="rounded-3xl overflow-hidden shadow-md" style={{ border: '2px solid #E8B84B' }}>
        <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#E8B84B' }}>
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-white font-black text-base">Cambio de aceite vencido</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>Hacelo lo antes posible</p>
          </div>
        </div>
        <div className="p-5" style={{ background: '#FFFBF0' }}>
          <p className="font-bold text-lg mb-1" style={{ color: '#8B6800' }}>
            Pasado por {kmOverdue.toLocaleString()} km
          </p>
          <p className="text-sm mb-4" style={{ color: '#A07060' }}>
            Último cambio a los {lastOilKm.toLocaleString()} km
            {lastOilDate && ` · ${new Date(lastOilDate).toLocaleDateString('es-AR')}`}.
            El aceite viejo desgasta el motor más rápido.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="w-full py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: '#E8B84B' }}>
            Ya lo cambié — registrar
          </button>
        </div>
      </div>
    )
  }

  const pct = Math.min(((10000 - oilKmLeft!) / 10000) * 100, 100)
  const barColor = oilKmLeft! < 1000 ? '#E8B84B' : '#7CB897'

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
      <h2 className="font-bold mb-3" style={{ color: '#5C2A1E' }}>🛢️ Cambio de aceite y filtro</h2>
      <div className="flex justify-between text-xs mb-1" style={{ color: '#C49080' }}>
        <span>Último: {lastOilKm.toLocaleString()} km</span>
        <span style={{ color: barColor }}>Próximo: {nextOilKm!.toLocaleString()} km</span>
      </div>
      <div className="w-full rounded-full h-2.5 mb-2" style={{ background: '#F5DDD6' }}>
        <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: barColor }}>
        {oilKmLeft! < 1000
          ? `⚡ Quedan solo ${oilKmLeft!.toLocaleString()} km — agendalo ya`
          : `✅ Quedan ${oilKmLeft!.toLocaleString()} km para el próximo cambio`}
      </p>
      <button onClick={() => setEditing(true)} className="mt-2 text-xs underline" style={{ color: '#C97B5A' }}>
        Actualizar último cambio
      </button>
    </div>
  )
}
