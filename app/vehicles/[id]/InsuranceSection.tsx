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

  const cardBg = isExpired ? '#FFF0EB' : isUrgent ? '#FFF0EB' : isWarning ? '#FFFBF0' : 'white'
  const cardBorder = isExpired ? '#D94F3D' : isUrgent ? '#E8B84B' : isWarning ? '#E8B84B' : '#F5DDD6'

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  return (
    <div className="rounded-3xl p-5 shadow-sm" style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <div className="text-left">
          <h2 className="font-bold" style={{ color: isExpired ? '#D94F3D' : '#5C2A1E' }}>
            🛡️ Seguro del auto
          </h2>
          {!open && insuranceCompany && (
            <p className="text-xs mt-0.5" style={{ color: '#C49080' }}>{insuranceCompany} · Póliza {insurancePolicy}</p>
          )}
        </div>
        <span className="text-sm" style={{ color: '#C49080' }}>{open ? '▲' : '▼'}</span>
      </button>

      {!open && daysToExpiry !== null && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
          style={{
            color: isExpired ? '#D94F3D' : isUrgent ? '#8B6800' : isWarning ? '#8B6800' : '#4A9B6E',
          }}>
          {isExpired ? '🔴 VENCIDO — renovalo hoy' :
           isUrgent ? `🟠 Vence en ${daysToExpiry} días — renovalo ya` :
           isWarning ? `🟡 Vence en ${daysToExpiry} días` :
           `✅ Vigente — vence en ${daysToExpiry} días`}
        </div>
      )}

      {!open && insuranceFileUrl && (
        <a
          href={insuranceFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 text-xs hover:underline"
          style={{ color: '#C97B5A' }}>
          📄 Ver documentación del seguro
        </a>
      )}

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Compañía aseguradora
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Ej: La Caja, Sancor, Zurich..."
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Número de póliza
            </label>
            <input
              type="text"
              value={policy}
              onChange={e => setPolicy(e.target.value)}
              placeholder="Ej: 12345678"
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>
              Documentación <span style={{ fontWeight: 400 }}>(foto o PDF)</span>
            </label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors"
              style={{ border: '1.5px dashed #E8B4A0', background: '#FFF5F2' }}>
              <span className="text-2xl">{uploading ? '⏳' : '📎'}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: '#5C2A1E' }}>
                  {uploading ? 'Subiendo...' : insuranceFileUrl ? 'Reemplazar archivo' : 'Subir comprobante'}
                </p>
                <p className="text-xs" style={{ color: '#C49080' }}>Foto, PDF o imagen del seguro</p>
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
                className="mt-2 flex items-center gap-1 text-xs hover:underline" style={{ color: '#C97B5A' }}>
                📄 Ver archivo actual
              </a>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white"
            style={{ background: saved ? '#7CB897' : '#C97B5A' }}>
            {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar seguro'}
          </button>
        </div>
      )}
    </div>
  )
}
