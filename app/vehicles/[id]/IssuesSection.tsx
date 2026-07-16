'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Issue = {
  id: string
  title: string
  description: string | null
  location: string | null
  status: 'pendiente' | 'en_taller' | 'resuelto'
  priority: 'urgente' | 'normal' | 'leve'
  reported_at: string
  resolved_at: string | null
}

type Props = {
  vehicleId: string
  issues: Issue[]
}

const PRIORITY_STYLES = {
  urgente: { bg: '#FFF0EB', text: '#D94F3D', label: '🔴 Urgente' },
  normal:  { bg: '#FFFBF0', text: '#8B6800', label: '🟡 Normal' },
  leve:    { bg: '#F5F5F5', text: '#6B7280', label: '⚪ Leve' },
}

const STATUS_STYLES = {
  pendiente: { bg: '#FFF0EB', border: '#E8B4A0', badge: { bg: '#FFF0EB', color: '#D94F3D' }, label: 'Pendiente' },
  en_taller: { bg: '#FFFBF0', border: '#E8B84B', badge: { bg: '#FFFBF0', color: '#8B6800' }, label: 'En taller' },
  resuelto:  { bg: '#F0FBF5', border: '#7CB897', badge: { bg: '#F0FBF5', color: '#4A9B6E' }, label: 'Resuelto' },
}

export default function IssuesSection({ vehicleId, issues: initialIssues }: Props) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState<'urgente' | 'normal' | 'leve'>('normal')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('vehicle_issues')
      .insert({ vehicle_id: vehicleId, title, description, location, priority })
      .select()
      .single()

    if (!error && data) {
      setIssues(prev => [data, ...prev])
      setTitle('')
      setDescription('')
      setLocation('')
      setPriority('normal')
      setShowForm(false)
    }
    setLoading(false)
  }

  const updateStatus = async (issueId: string, status: Issue['status']) => {
    const updates: Partial<Issue> = { status }
    if (status === 'resuelto') updates.resolved_at = new Date().toISOString()

    const { error } = await supabase
      .from('vehicle_issues')
      .update(updates)
      .eq('id', issueId)

    if (!error) {
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, ...updates } : i))
      router.refresh()
    }
  }

  const pendientes = issues.filter(i => i.status !== 'resuelto')
  const resueltos = issues.filter(i => i.status === 'resuelto')

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1.5px solid #F5DDD6' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold" style={{ color: '#5C2A1E' }}>🔧 Desperfectos y novedades</h2>
          <p className="text-xs" style={{ color: '#C49080' }}>Registrá problemas para no olvidarlos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-bold text-white px-4 py-2 rounded-xl"
          style={{ background: showForm ? '#C49080' : '#C97B5A' }}>
          {showForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl p-4 mb-4 space-y-3" style={{ background: '#FFF5F2', border: '1px solid #F5DDD6' }}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>¿Qué tiene?</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Ej: Óptica trasera con humedad"
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>Ubicación en el auto</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ej: Trasero izquierdo"
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#C49080' }}>Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Contá todo lo que notes para no olvidarte al ir al taller..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C97B5A')}
              onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: '#C49080' }}>Prioridad</label>
            <div className="flex gap-2">
              {(['urgente', 'normal', 'leve'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: priority === p ? PRIORITY_STYLES[p].bg : 'white',
                    color: priority === p ? PRIORITY_STYLES[p].text : '#C49080',
                    border: `1.5px solid ${priority === p ? PRIORITY_STYLES[p].text : '#F5DDD6'}`,
                  }}>
                  {PRIORITY_STYLES[p].label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: '#C97B5A' }}>
            {loading ? 'Guardando...' : 'Registrar desperfecto'}
          </button>
        </form>
      )}

      {pendientes.length === 0 && !showForm && (
        <div className="text-center py-6" style={{ color: '#C49080' }}>
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm">Sin desperfectos registrados</p>
        </div>
      )}

      <div className="space-y-3">
        {pendientes.map(issue => {
          const statusStyle = STATUS_STYLES[issue.status]
          const priorityStyle = PRIORITY_STYLES[issue.priority]
          return (
            <div key={issue.id} className="rounded-2xl p-4"
              style={{ background: statusStyle.bg, border: `1.5px solid ${statusStyle.border}` }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: '#3D1810' }}>{issue.title}</p>
                  {issue.location && (
                    <p className="text-xs mt-0.5" style={{ color: '#C49080' }}>📍 {issue.location}</p>
                  )}
                  {issue.description && (
                    <p className="text-xs mt-1" style={{ color: '#A07060' }}>{issue.description}</p>
                  )}
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
                  style={{ background: priorityStyle.bg, color: priorityStyle.text }}>
                  {priorityStyle.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: statusStyle.badge.bg, color: statusStyle.badge.color }}>
                  {statusStyle.label}
                </span>
                <span style={{ color: '#F5DDD6' }}>·</span>
                {issue.status === 'pendiente' && (
                  <button onClick={() => updateStatus(issue.id, 'en_taller')}
                    className="text-xs font-semibold hover:underline" style={{ color: '#8B6800' }}>
                    Llevé al taller
                  </button>
                )}
                {issue.status === 'en_taller' && (
                  <button onClick={() => updateStatus(issue.id, 'resuelto')}
                    className="text-xs font-semibold hover:underline" style={{ color: '#4A9B6E' }}>
                    Marcar resuelto
                  </button>
                )}
                {issue.status !== 'resuelto' && (
                  <>
                    <span style={{ color: '#F5DDD6' }}>·</span>
                    <button onClick={() => updateStatus(issue.id, 'resuelto')}
                      className="text-xs hover:underline" style={{ color: '#C49080' }}>
                      Resolver
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {resueltos.length > 0 && (
        <details className="mt-4">
          <summary className="text-xs cursor-pointer hover:underline" style={{ color: '#C49080' }}>
            Ver {resueltos.length} desperfecto{resueltos.length > 1 ? 's' : ''} resuelto{resueltos.length > 1 ? 's' : ''}
          </summary>
          <div className="space-y-2 mt-2">
            {resueltos.map(issue => (
              <div key={issue.id} className="rounded-xl p-3" style={{ background: '#F5F5F5' }}>
                <p className="text-sm line-through" style={{ color: '#C49080' }}>{issue.title}</p>
                {issue.location && <p className="text-xs" style={{ color: '#D4B5A8' }}>📍 {issue.location}</p>}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
