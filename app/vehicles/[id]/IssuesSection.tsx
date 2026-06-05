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
  urgente: { bg: 'bg-red-100', text: 'text-red-700', label: '🔴 Urgente' },
  normal:  { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🟡 Normal' },
  leve:    { bg: 'bg-gray-100', text: 'text-gray-600', label: '⚪ Leve' },
}

const STATUS_STYLES = {
  pendiente:  { bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', label: 'Pendiente' },
  en_taller:  { bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', label: 'En taller' },
  resuelto:   { bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700', label: 'Resuelto' },
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

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold" style={{ color: '#1e3a5f' }}>🔧 Desperfectos y novedades</h2>
          <p className="text-xs text-gray-400">Registrá problemas para no olvidarlos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-bold text-white px-4 py-2 rounded-xl"
          style={{ background: showForm ? '#6b7280' : '#1e3a5f' }}>
          {showForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {/* Formulario nuevo desperfecto */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">¿Qué tiene?</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Ej: Óptica trasera con humedad"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Ubicación en el auto</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ej: Trasero izquierdo (lado conductor)"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Descripción detallada</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Contá todo lo que notes para no olvidarte al ir al taller..."
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Prioridad</label>
            <div className="flex gap-2">
              {(['urgente', 'normal', 'leve'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    priority === p
                      ? `${PRIORITY_STYLES[p].bg} ${PRIORITY_STYLES[p].text} border-current`
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                  {PRIORITY_STYLES[p].label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: '#1e3a5f' }}>
            {loading ? 'Guardando...' : 'Registrar desperfecto'}
          </button>
        </form>
      )}

      {/* Lista pendientes */}
      {pendientes.length === 0 && !showForm && (
        <div className="text-center py-6 text-gray-400">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm">Sin desperfectos registrados</p>
        </div>
      )}

      <div className="space-y-3">
        {pendientes.map(issue => {
          const statusStyle = STATUS_STYLES[issue.status]
          const priorityStyle = PRIORITY_STYLES[issue.priority]
          return (
            <div key={issue.id} className={`rounded-2xl p-4 border-2 ${statusStyle.bg}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-800">{issue.title}</p>
                  {issue.location && (
                    <p className="text-xs text-gray-500 mt-0.5">📍 {issue.location}</p>
                  )}
                  {issue.description && (
                    <p className="text-xs text-gray-500 mt-1">{issue.description}</p>
                  )}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${priorityStyle.bg} ${priorityStyle.text}`}>
                  {priorityStyle.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle.badge}`}>
                  {statusStyle.label}
                </span>
                <span className="text-gray-300">·</span>
                {issue.status === 'pendiente' && (
                  <button onClick={() => updateStatus(issue.id, 'en_taller')}
                    className="text-xs text-yellow-600 font-semibold hover:underline">
                    Llevé al taller
                  </button>
                )}
                {issue.status === 'en_taller' && (
                  <button onClick={() => updateStatus(issue.id, 'resuelto')}
                    className="text-xs text-green-600 font-semibold hover:underline">
                    Marcar resuelto
                  </button>
                )}
                {issue.status !== 'resuelto' && (
                  <>
                    <span className="text-gray-300">·</span>
                    <button onClick={() => updateStatus(issue.id, 'resuelto')}
                      className="text-xs text-gray-400 hover:underline">
                      Resolver
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Resueltos colapsados */}
      {resueltos.length > 0 && (
        <details className="mt-4">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            Ver {resueltos.length} desperfecto{resueltos.length > 1 ? 's' : ''} resuelto{resueltos.length > 1 ? 's' : ''}
          </summary>
          <div className="space-y-2 mt-2">
            {resueltos.map(issue => (
              <div key={issue.id} className="rounded-xl p-3 bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-400 line-through">{issue.title}</p>
                {issue.location && <p className="text-xs text-gray-300">📍 {issue.location}</p>}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
