'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setResetLoading(false)
    if (!error) setResetSent(true)
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#FDF0EB' }}>

      {/* Header con color + emoji */}
      <div style={{ background: '#E8B4A0', paddingTop: '48px', paddingBottom: '48px' }} className="text-center">
        <Link href="/" className="inline-block mb-3 text-sm font-medium" style={{ color: '#5C2A1E', opacity: 0.7 }}>
          ← Volver
        </Link>
        <div style={{ fontSize: '64px', lineHeight: 1 }}>🚗</div>
        <p className="mt-3 font-bold text-lg" style={{ color: '#3D1810' }}>AutoFamilia</p>
      </div>

      {/* Card flotante */}
      <div className="flex-1 px-5 -mt-6">
        <div className="bg-white rounded-3xl shadow-lg px-6 pt-8 pb-8">

          {resetMode ? (
            <>
              <button onClick={() => { setResetMode(false); setResetSent(false) }} className="text-sm mb-4" style={{ color: '#C49080' }}>
                ← Volver al login
              </button>
              <h2 className="text-xl font-extrabold mb-1" style={{ color: '#3D1810' }}>Recuperar contraseña</h2>
              <p className="text-sm mb-6" style={{ color: '#A07060' }}>Te mandamos un link para crear una nueva contraseña.</p>

              {resetSent ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">📬</div>
                  <p className="font-bold" style={{ color: '#4A9B6E' }}>¡Listo! Revisá tu email</p>
                  <p className="text-sm mt-2" style={{ color: '#A07060' }}>
                    Te mandamos un link a <strong>{email}</strong>. Si no llega en unos minutos, revisá la carpeta de spam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                      Tu email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                      style={{ background: '#FFF5F2', border: '1.5px solid #F5DDD6', color: '#3D1810' }}
                      onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                      onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-60"
                    style={{ background: '#C97B5A' }}>
                    {resetLoading ? 'Enviando...' : 'Mandarme el link'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-extrabold mb-1" style={{ color: '#3D1810' }}>Bienvenida de vuelta</h2>
              <p className="text-sm mb-6" style={{ color: '#A07060' }}>Ingresá para ver el estado de tus autos.</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                    Tu email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                    style={{ background: '#FFF5F2', border: '1.5px solid #F5DDD6', color: '#3D1810' }}
                    onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                    onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#C49080' }}>
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setResetMode(true)}
                      className="text-xs"
                      style={{ color: '#C97B5A' }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                    style={{ background: '#FFF5F2', border: '1.5px solid #F5DDD6', color: '#3D1810' }}
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
                  className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-60 mt-2"
                  style={{ background: '#C97B5A' }}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: '#C49080' }}>
                ¿No tenés cuenta?{' '}
                <Link href="/register" className="font-bold" style={{ color: '#C97B5A' }}>
                  Registrate gratis
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="py-6" />
    </main>
  )
}
