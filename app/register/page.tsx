'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) {
      setError('Tenés que aceptar los términos para continuar.')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        full_name: name,
        terms_accepted_at: new Date().toISOString(),
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  const inputStyle = {
    background: '#FFF5F2',
    border: '1.5px solid #F5DDD6',
    color: '#3D1810',
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#FDF0EB' }}>

      {/* Header emocional */}
      <div style={{ background: '#E8B4A0', paddingTop: '40px', paddingBottom: '40px' }} className="text-center">
        <Link href="/" className="inline-block mb-3 text-sm font-medium" style={{ color: '#5C2A1E', opacity: 0.7 }}>
          ← Volver
        </Link>
        <div style={{ fontSize: '56px', lineHeight: 1 }}>🛡️</div>
        <p className="mt-3 font-bold text-base" style={{ color: '#3D1810' }}>Empezá a cuidar tu auto hoy</p>
        <p className="text-sm mt-1" style={{ color: '#5C2A1E', opacity: 0.7 }}>Gratis · 2 minutos · Sin tarjeta</p>
      </div>

      {/* Card flotante */}
      <div className="flex-1 px-5 -mt-6">
        <div className="bg-white rounded-3xl shadow-lg px-6 pt-8 pb-8">

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                placeholder="María García"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#C49080' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                style={inputStyle}
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
                minLength={6}
                className="w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#C97B5A')}
                onBlur={e => (e.target.style.borderColor = '#F5DDD6')}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Términos */}
            <div className="rounded-2xl p-4" style={{ background: '#FFF5F2', border: '1px solid #F5DDD6' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 flex-shrink-0"
                  style={{ accentColor: '#C97B5A' }}
                />
                <span className="text-xs" style={{ color: '#8B4A36', lineHeight: 1.5 }}>
                  Leí y acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(!showTerms)}
                    className="font-bold underline"
                    style={{ color: '#C97B5A' }}>
                    Términos y Condiciones
                  </button>
                  {' '}— los datos de mantenimiento son orientativos, no reemplazan al mecánico.
                </span>
              </label>

              {showTerms && (
                <div className="mt-3 text-xs rounded-xl p-3 max-h-48 overflow-y-auto space-y-2"
                  style={{ background: 'white', border: '1px solid #F5DDD6', color: '#A07060' }}>
                  <p className="font-bold" style={{ color: '#5C2A1E' }}>Términos y Condiciones de AutoFamilia</p>
                  <p><strong>1. Información de mantenimiento</strong><br />
                    Los calendarios y recomendaciones son orientativos y se basan en información general de referencia. No reemplazan los manuales oficiales del fabricante ni el asesoramiento de un mecánico certificado.</p>
                  <p><strong>2. Limitación de responsabilidad</strong><br />
                    AutoFamilia no se responsabiliza por daños mecánicos, accidentes ni gastos derivados del uso de la información provista.</p>
                  <p><strong>3. Datos personales</strong><br />
                    Tu información se almacena de forma segura y no se comparte con terceros sin tu consentimiento. Podés solicitar la eliminación de tu cuenta en cualquier momento.</p>
                  <p><strong>4. Uso del servicio</strong><br />
                    Al usar AutoFamilia aceptás utilizarlo de buena fe, para uso personal y familiar.</p>
                  <p style={{ color: '#C49080' }}>Última actualización: junio 2026</p>
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm px-4 py-3 rounded-2xl" style={{ background: '#FFF0EB', color: '#D94F3D' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-50 mt-1"
              style={{ background: '#C97B5A' }}>
              {loading ? 'Creando cuenta...' : 'Empezar gratis'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#C49080' }}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="font-bold" style={{ color: '#C97B5A' }}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>

      <div className="py-6" />
    </main>
  )
}
