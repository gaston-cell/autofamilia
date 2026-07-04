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
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Contraseña
              </label>
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
        </div>
      </div>

      <div className="py-6" />
    </main>
  )
}
