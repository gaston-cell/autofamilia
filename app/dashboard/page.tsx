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
    <div className="min-h-screen" style={{ background: '#FFF5F2' }}>
      <header style={{ background: '#C97B5A' }} className="px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: '#F5DDD6' }}>Hola, {name} 👋</p>
          <h1 className="text-white text-xl font-bold">AutoFamilia</h1>
        </div>
        <form action="/auth/logout" method="post">
          <button className="text-sm hover:text-white" style={{ color: '#F5DDD6' }}>Salir</button>
        </form>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#5C2A1E' }}>Mis autos</h2>
          {vehicles && vehicles.length < 5 && (
            <Link href="/vehicles/new"
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl"
              style={{ background: '#7CB897' }}>
              + Agregar auto
            </Link>
          )}
        </div>

        {(!vehicles || vehicles.length === 0) && (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm" style={{ border: '1px solid #F5DDD6' }}>
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="font-bold mb-2" style={{ color: '#5C2A1E' }}>Todavía no registraste ningún auto</h3>
            <p className="text-sm mb-6" style={{ color: '#C49080' }}>Agregá tu auto y te decimos qué mantenimiento necesita según el kilometraje.</p>
            <Link href="/vehicles/new"
              className="inline-block px-8 py-3 rounded-2xl font-bold text-white"
              style={{ background: '#C97B5A' }}>
              Registrar mi primer auto
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {vehicles?.map(vehicle => {
            const pct = Math.min((vehicle.current_km / 250000) * 100, 100)
            return (
              <Link href={`/vehicles/${vehicle.id}`} key={vehicle.id}>
                <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #F5DDD6' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold" style={{ color: '#5C2A1E' }}>{vehicle.nickname || `${vehicle.brand} ${vehicle.model}`}</h3>
                      <p className="text-sm" style={{ color: '#C49080' }}>{vehicle.year} · {vehicle.version}</p>
                    </div>
                    <StatusBadge km={vehicle.current_km} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-full h-2" style={{ background: '#F5DDD6' }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: '#E8B4A0' }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#8B4A36' }}>{vehicle.current_km.toLocaleString()} km</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-6 bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1px solid #F5DDD6' }}>
          <h3 className="font-bold mb-4" style={{ color: '#5C2A1E' }}>🛡️ Chequeo Pre-Viaje</h3>
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
                <input type="checkbox" className="w-5 h-5 rounded" style={{ accentColor: '#C97B5A' }} />
                <span className="text-sm" style={{ color: '#8B4A36' }}>{item}</span>
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
    return <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#FEF0E7', color: '#C97B5A' }}>Service pronto</span>
  }
  return <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#E8F5EE', color: '#4A9B6E' }}>Al día</span>
}
