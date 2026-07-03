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
    <main className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #E8B4A0 0%, #F5DDD6 100%)' }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🚗</div>
        <h1 className="text-3xl font-bold" style={{ color: '#5C2A1E' }}>AutoFamilia</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6" style={{ color: '#5C2A1E' }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#8B4A36' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none"
              style={{ borderColor: '#F5DDD6' }}
              onFocus={e => e.target.style.borderColor = '#E8B4A0'}
              onBlur={e => e.target.style.borderColor = '#F5DDD6'}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#8B4A36' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none"
              style={{ borderColor: '#F5DDD6' }}
              onFocus={e => e.target.style.borderColor = '#E8B4A0'}
              onBlur={e => e.target.style.borderColor = '#F5DDD6'}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm p-3 rounded-xl" style={{ background: '#FFF0EB', color: '#D94F3D' }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: '#C97B5A' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#C49080' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#C97B5A' }}>
            Registrate gratis
          </Link>
        </p>
      </div>
    </main>
  )
}
