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
      setError('Tenés que aceptar los términos y condiciones para continuar.')
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #C97B5A 0%, #C97B5A 100%)' }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🚗</div>
        <h1 className="text-3xl font-bold text-white">AutoFamilia</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6" style={{ color: '#C97B5A' }}>Crear cuenta gratis</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tu nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              placeholder="María García"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* Términos y condiciones */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-600">
                Leí y acepto los{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(!showTerms)}
                  className="font-semibold underline"
                  style={{ color: '#C97B5A' }}>
                  Términos y Condiciones
                </button>
                , incluyendo el aviso legal sobre los datos de mantenimiento.
              </span>
            </label>

            {showTerms && (
              <div className="mt-3 text-xs text-gray-500 bg-white rounded-xl p-3 border border-gray-200 max-h-48 overflow-y-auto space-y-2">
                <p className="font-bold text-gray-700">Términos y Condiciones de AutoFamilia</p>

                <p><strong>1. Información de mantenimiento</strong><br />
                Los calendarios y recomendaciones de mantenimiento en AutoFamilia son orientativos y se basan en información general de referencia. No constituyen asesoramiento técnico profesional ni reemplazan los manuales oficiales del fabricante de su vehículo.</p>

                <p><strong>2. Limitación de responsabilidad</strong><br />
                AutoFamilia no se responsabiliza por daños mecánicos, accidentes, gastos de reparación ni ningún perjuicio derivado del uso o no uso de la información provista. Siempre consultá con un mecánico o técnico certificado para decisiones importantes.</p>

                <p><strong>3. Datos personales</strong><br />
                Tu información se almacena de forma segura y no es compartida con terceros sin tu consentimiento. Podés solicitar la eliminación de tu cuenta y datos en cualquier momento.</p>

                <p><strong>4. Uso del servicio</strong><br />
                Al usar AutoFamilia aceptás utilizar el servicio de buena fe, para uso personal y familiar, sin fines comerciales no autorizados.</p>

                <p className="text-gray-400">Última actualización: junio 2026</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: '#7CB897' }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#C97B5A' }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
