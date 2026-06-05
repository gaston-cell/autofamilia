'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  vehicleId: string
  insuranceCompany: string | null
  insurancePolicy: string | null
  insuranceExpiry: string | null
  insuranceFileUrl: string | null
}

export default function InsuranceSection({
  vehicleId,
  insuranceCompany,
  insurancePolicy,
  insuranceExpiry,
  insuranceFileUrl,
}: Props) {
  const [open, setOpen] = useState(!insuranceCompany)
  const [company, setCompany] = useState(insuranceCompany || '')
  const [policy, setPolicy] = useState(insurancePolicy || '')
  const [expiry, setExpiry] = useState(insuranceExpiry || '')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const daysToExpiry = insuranceExpiry
    ? Math.floor((new Date(insuranceExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isExpired = daysToExpiry !== null && daysToExpiry < 0
  const isUrgent = daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 15
  const isWarning = daysToExpiry !== null && daysToExpiry > 15 && daysToExpiry <= 30

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${vehicleId}-seguro.${fileExt}`

    const { data, error } = await supabase.storage
      .from('vehicle-docs')
      .upload(fileName, file, { upsert: true })

    if (!error && data) {
      const { data: urlData } = supabase.storage.from('vehicle-docs').getPublicUrl(fileName)
      await supabase.from('vehicles').update({ insurance_file_url: urlData.publicUrl }).eq('id', vehicleId)
      router.refresh()
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setLoading(true)
    await supabase.from('vehicles').update({
      insurance_company: company || null,
      insurance_policy: policy || null,
      insurance_expiry: expiry || null,
    }).eq('id', vehicleId)
    setLoading(false)
    setSaved(true)
    setOpen(false)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  return (
    <div className={`rounded-3xl p-5 shadow-sm border-2 ${
      isExpired ? 'bg-red-50 border-red-300' :
      isUrgent ? 'bg-orange-50 border-orange-200' :
      isWarning ? 'bg-yellow-50 border-yellow-200' :
      'bg-white border-gray-100'
    }`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <div className="text-left">
          <h2 className="font-bold" style={{ color: isExpired || isUrgent ? '#dc2626' : '#1e3a5f' }}>
            🛡️ Seguro del auto
          </h2>
          {!open && insuranceCompany && (
            <p className="text-xs text-gray-500 mt-0.5">{insuranceCompany} · Póliza {insurancePolicy}</p>
          )}
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {/* Alerta de vencimiento */}
      {!open && daysToExpiry !== null && (
        <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${
          isExpired ? 'text-red-700' : isUrgent ? 'text-orange-700' : isWarning ? 'text-yellow-700' : 'text-green-700'
        }`}>
          {isExpired ? '🔴 VENCIDO' :
           isUrgent ? `🟠 Vence en ${daysToExpiry} días — renovalo ya` :
           isWarning ? `🟡 Vence en ${daysToExpiry} días` :
           `✅ Vigente — vence en ${daysToExpiry} días`}
        </div>
      )}

      {/* Archivo subido */}
      {!open && insuranceFileUrl && (
        <a
          href={insuranceFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 text-xs text-blue-600 hover:underline">
          📄 Ver documentación del seguro
        </a>
      )}

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Compañía aseguradora</label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Ej: La Caja, Sancor, Zurich..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Número de póliza</label>
            <input
              type="text"
              value={policy}
              onChange={e => setPolicy(e.target.value)}
              placeholder="Ej: 12345678"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Fecha de vencimiento</label>
            <input
              type="date"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Documentación del seguro <span className="text-gray-400 font-normal">(foto o PDF)</span>
            </label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
              <span className="text-2xl">{uploading ? '⏳' : '📎'}</span>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {uploading ? 'Subiendo...' : insuranceFileUrl ? 'Reemplazar archivo' : 'Subir comprobante'}
                </p>
                <p className="text-xs text-gray-400">Foto, PDF o imagen del seguro</p>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {insuranceFileUrl && (
              <a href={insuranceFileUrl} target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline">
                📄 Ver archivo actual
              </a>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white"
            style={{ background: saved ? '#10b981' : '#1e3a5f' }}>
            {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar seguro'}
          </button>
        </div>
      )}
    </div>
  )
}
