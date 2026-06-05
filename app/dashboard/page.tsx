import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const name = user.user_metadata?.full_name?.split(' ')[0] || 'Usuario'

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      {/* Header */}
      <header style={{ background: '#1e3a5f' }} className="px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-sm">Hola, {name} 👋</p>
          <h1 className="text-white text-xl font-bold">AutoFamilia</h1>
        </div>
        <form action="/auth/logout" method="post">
          <button className="text-blue-200 text-sm hover:text-white">Salir</button>
        </form>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Mis autos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#1e3a5f' }}>Mis autos</h2>
          {vehicles && vehicles.length < 5 && (
            <Link href="/vehicles/new"
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl"
              style={{ background: '#10b981' }}>
              + Agregar auto
            </Link>
          )}
        </div>

        {/* Sin autos */}
        {(!vehicles || vehicles.length === 0) && (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="font-bold text-gray-700 mb-2">Todavía no registraste ningún auto</h3>
            <p className="text-gray-400 text-sm mb-6">Agregá tu auto y te decimos qué mantenimiento necesita según el kilometraje.</p>
            <Link href="/vehicles/new"
              className="inline-block px-8 py-3 rounded-2xl font-bold text-white"
              style={{ background: '#1e3a5f' }}>
              Registrar mi primer auto
            </Link>
          </div>
        )}

        {/* Lista de autos */}
        <div className="space-y-4">
          {vehicles?.map(vehicle => {
            const pct = Math.min((vehicle.current_km / 250000) * 100, 100)
            return (
              <Link href={`/vehicles/${vehicle.id}`} key={vehicle.id}>
                <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{vehicle.brand} {vehicle.model}</h3>
                      <p className="text-sm text-gray-400">{vehicle.year} · {vehicle.version}</p>
                    </div>
                    <StatusBadge km={vehicle.current_km} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: '#0ea5e9' }} />
                    </div>
                    <span className="text-sm font-bold text-gray-600">{vehicle.current_km.toLocaleString()} km</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Chequeo pre-viaje */}
        <div className="mt-6 bg-white rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold mb-4" style={{ color: '#1e3a5f' }}>🛡️ Chequeo Pre-Viaje</h3>
          <div className="space-y-3">
            {[
              'Presión de neumáticos (incluido el auxilio)',
              'Nivel de aceite y líquido refrigerante',
              'Luces: altas, bajas y de freno',
              'Líquido limpiaparabrisas',
              'Documentación: seguro y cédula vigentes',
              'Sillitas infantiles bien ancladas',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-500" />
                <span className="text-sm text-gray-600">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ km }: { km: number }) {
  if (km % 10000 >= 9000 || km % 10000 <= 500) {
    return <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">Service pronto</span>
  }
  return <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">Al día</span>
}
