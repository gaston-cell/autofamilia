import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)' }}>
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="text-4xl font-bold text-white mb-2">AutoFamilia</h1>
        <p className="text-blue-100 text-lg">Tu auto al día, tu familia segura</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-6" style={{ color: '#1e3a5f' }}>
          Cuidá tu auto en minutos
        </h2>

        <div className="space-y-3">
          <Link href="/login"
            className="block w-full text-center py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#1e3a5f' }}>
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="block w-full text-center py-4 rounded-2xl font-bold transition-all hover:opacity-90 border-2"
            style={{ color: '#1e3a5f', borderColor: '#1e3a5f' }}>
            Crear cuenta gratis
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl">🔔</div>
            <p className="text-xs text-gray-500 mt-1">Alertas por km</p>
          </div>
          <div>
            <div className="text-2xl">📋</div>
            <p className="text-xs text-gray-500 mt-1">Manual incluido</p>
          </div>
          <div>
            <div className="text-2xl">👨‍👩‍👧</div>
            <p className="text-xs text-gray-500 mt-1">Hasta 5 autos</p>
          </div>
        </div>
      </div>
    </main>
  )
}
