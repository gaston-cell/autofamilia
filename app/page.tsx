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
      style={{ background: 'linear-gradient(135deg, #E8B4A0 0%, #F5DDD6 100%)' }}>
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#5C2A1E' }}>AutoFamilia</h1>
        <p className="text-lg" style={{ color: '#8B4A36' }}>Tu auto al día, tu familia segura</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-6" style={{ color: '#5C2A1E' }}>
          Cuidá tu auto en minutos
        </h2>

        <div className="space-y-3">
          <Link href="/login"
            className="block w-full text-center py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#C97B5A' }}>
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="block w-full text-center py-4 rounded-2xl font-bold transition-all hover:opacity-90 border-2"
            style={{ color: '#C97B5A', borderColor: '#E8B4A0' }}>
            Crear cuenta gratis
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl">🔔</div>
            <p className="text-xs mt-1" style={{ color: '#C49080' }}>Alertas por km</p>
          </div>
          <div>
            <div className="text-2xl">📋</div>
            <p className="text-xs mt-1" style={{ color: '#C49080' }}>Manual incluido</p>
          </div>
          <div>
            <div className="text-2xl">👨‍👩‍👧</div>
            <p className="text-xs mt-1" style={{ color: '#C49080' }}>Hasta 5 autos</p>
          </div>
        </div>
      </div>
    </main>
  )
}
