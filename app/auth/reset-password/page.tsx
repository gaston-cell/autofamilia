'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase maneja la sesión desde el hash del URL automáticamente
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('No pudimos actualizar la contraseña. El link puede haber vencido.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#FDF0EB' }}>
      <div style={{ background: '#E8B4A0', paddingTop: '48px', paddingBottom: '48px' }} className="text-center">
        <div style={{ fontSize: '64px', lineHeight: 1 }}>🔑</div>
        <p className="mt-3 font-bold text-lg" style={{ color: '#3D1810' }}>AutoFamilia</p>
      </div>

      <div className="flex-1 px-5 -mt-6">
        <div className="bg-white rounded-3xl shadow-lg px-6 pt-8 pb-8">
          {done ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-lg" style={{ color: '#4A9B6E' }}>¡Contraseña actualizada!</p>
              <p className="text-sm mt-2" style={{ color: '#A07060' }}>Te llevamos a tu cuenta...</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-extrabold mb-1" style={{ color: '#3D1810' }}>Nueva contraseña</h2>
              <p className="text-sm mb-6" style={{ color: '#A07060' }}>Elegí una contraseña nueva para tu cuenta.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                    onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                    Repetir contraseña
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                    onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="text-sm px-4 py-3 rounded-2xl" style={{ background: '#FFF0EB', color: '#D94F3D' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: '#C97B5A' }}>
                  {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="py-6" />
    </main>
  )
}
