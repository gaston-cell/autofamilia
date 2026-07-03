import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCarById, getMaintenanceUpToKm, getUpcomingMaintenance } from '@/lib/maintenance-data'
import Link from 'next/link'
import UpdateKmForm from './UpdateKmForm'
import MaintenanceChecklist from './MaintenanceChecklist'
import OilServiceSection from './OilServiceSection'
import IssuesSection from './IssuesSection'
import VehicleProfileSection from './VehicleProfileSection'
import TiresSection from './TiresSection'
import WashSection from './WashSection'
import InsuranceSection from './InsuranceSection'

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*, maintenance_logs(*), vehicle_issues(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!vehicle) redirect('/dashboard')

  const car = getCarById(vehicle.car_model_id)
  const pastTasks = car ? getMaintenanceUpToKm(vehicle.car_model_id, vehicle.current_km) : []
  const upcomingTasks = car ? getUpcomingMaintenance(vehicle.car_model_id, vehicle.current_km, 5000) : []
  const completedTaskKms: number[] = vehicle.maintenance_logs?.map((l: { task_km: number }) => l.task_km) || []


  // Dividir tareas en realizadas, pendientes y urgentes
  const doneTasks = pastTasks.filter(t => completedTaskKms.includes(t.km))
  const pendingTasks = pastTasks.filter(t => !completedTaskKms.includes(t.km))
  const urgentTasks = pendingTasks.filter(t => t.severity === 'critical')
  const normalPendingTasks = pendingTasks.filter(t => t.severity !== 'critical')

  return (
    <div className="min-h-screen" style={{ background: '#FFF5F2' }}>
      <header style={{ background: '#C97B5A' }} className="px-6 py-5">
        <Link href="/dashboard" className="text-sm hover:text-white" style={{ color: '#F5DDD6' }}>← Mis autos</Link>
        <h1 className="text-white text-xl font-bold mt-1">
          {vehicle.nickname || `${vehicle.brand} ${vehicle.model}`}
        </h1>
        <p className="text-sm" style={{ color: '#F5DDD6' }}>{vehicle.year} · {vehicle.version} · {vehicle.engine}</p>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">

        {/* KM actual */}
        <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
          <p className="text-sm mb-1" style={{ color: '#C49080' }}>Kilometraje actual</p>
          <p className="text-4xl font-bold" style={{ color: '#5C2A1E' }}>
            {vehicle.current_km.toLocaleString()} km
          </p>
          <UpdateKmForm vehicleId={vehicle.id} currentKm={vehicle.current_km} />
        </div>

        {/* Aceite y filtro */}
        <OilServiceSection
          vehicleId={vehicle.id}
          lastOilKm={vehicle.last_oil_change_km}
          lastOilDate={vehicle.last_oil_change_date}
          currentKm={vehicle.current_km}
        />

        {/* Próximos mantenimientos */}
        {upcomingTasks.length > 0 && (
          <div className="rounded-3xl p-5 shadow-sm" style={{ background: '#FEF6EE', border: '1px solid #F5DDD6' }}>
            <h2 className="font-bold mb-3" style={{ color: '#8B4A36' }}>⏳ Se viene pronto (próximos 5,000 km)</h2>
            <div className="space-y-2">
              {upcomingTasks.map(task => (
                <div key={task.km} className="bg-white rounded-2xl p-3" style={{ border: '1px solid #F5DDD6' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#5C2A1E' }}>{task.task}</p>
                      <p className="text-xs mt-1" style={{ color: '#C49080' }}>{task.description}</p>
                    </div>
                    <span className="text-xs font-bold ml-2 whitespace-nowrap" style={{ color: '#C97B5A' }}>
                      a los {task.km.toLocaleString()} km
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URGENTES */}
        {urgentTasks.length > 0 && (
          <div className="rounded-3xl overflow-hidden shadow-md" style={{ border: '2px solid #D94F3D' }}>
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#D94F3D' }}>
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-white font-bold text-base">
                  {urgentTasks.length} mantenimiento{urgentTasks.length > 1 ? 's' : ''} urgente{urgentTasks.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs" style={{ color: '#FFD5CC' }}>Tu familia viaja más segura cuando revisás esto</p>
              </div>
            </div>
            <div className="p-5" style={{ background: '#FFF5F2' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#8B4A36' }}>
                Tildá los que ya realizaste:
              </p>
              <MaintenanceChecklist
                vehicleId={vehicle.id}
                tasks={urgentTasks}
                completedKms={completedTaskKms}
              />
            </div>
          </div>
        )}

        {/* PENDIENTES normales */}
        {normalPendingTasks.length > 0 && (
          <div className="rounded-3xl p-5 shadow-sm" style={{ background: '#FEF6EE', border: '1px solid #E8B4A0' }}>
            <h2 className="font-bold mb-1" style={{ color: '#8B4A36' }}>⚠️ Para revisar</h2>
            <p className="text-xs mb-3" style={{ color: '#C49080' }}>Seleccioná los que ya hiciste para registrarlos</p>
            <MaintenanceChecklist
              vehicleId={vehicle.id}
              tasks={normalPendingTasks}
              completedKms={completedTaskKms}
            />
          </div>
        )}

        {/* REALIZADOS */}
        {doneTasks.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1px solid #F5DDD6' }}>
            <h2 className="font-bold mb-1" style={{ color: '#4A9B6E' }}>✅ Realizados</h2>
            <p className="text-xs mb-3" style={{ color: '#C49080' }}>Tocá para desmarcar si te equivocaste</p>
            <MaintenanceChecklist
              vehicleId={vehicle.id}
              tasks={doneTasks}
              completedKms={completedTaskKms}
              variant="done"
            />
          </div>
        )}

        {/* Seguro */}
        <InsuranceSection
          vehicleId={vehicle.id}
          insuranceCompany={vehicle.insurance_company}
          insurancePolicy={vehicle.insurance_policy}
          insuranceExpiry={vehicle.insurance_expiry}
          insuranceFileUrl={vehicle.insurance_file_url}
        />

        {/* Neumáticos */}
        <TiresSection
          vehicleId={vehicle.id}
          tiresKm={vehicle.tires_km}
          tiresDot={vehicle.tires_dot}
          tiresInstalledDate={vehicle.tires_installed_date}
          currentKm={vehicle.current_km}
        />

        {/* Lavados */}
        <WashSection
          vehicleId={vehicle.id}
          lastWashDate={vehicle.last_wash_date}
          lastTeflonDate={vehicle.last_teflon_date}
          washCount={vehicle.wash_count || 0}
          sleepsIn={vehicle.sleeps_in}
        />

        {/* Perfil del auto */}
        <VehicleProfileSection
          vehicleId={vehicle.id}
          sleepsIn={vehicle.sleeps_in}
          zone={vehicle.zone}
          usageType={vehicle.usage_type}
        />

        {/* Desperfectos */}
        <IssuesSection
          vehicleId={vehicle.id}
          issues={vehicle.vehicle_issues || []}
        />

      </div>
    </div>
  )
}
