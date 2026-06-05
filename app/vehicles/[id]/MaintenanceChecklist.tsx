'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MaintenanceTask } from '@/lib/maintenance-data'

type Props = {
  vehicleId: string
  tasks: MaintenanceTask[]
  completedKms: number[]
  variant?: 'pending' | 'done'
}

export default function MaintenanceChecklist({ vehicleId, tasks, completedKms, variant = 'pending' }: Props) {
  const [loading, setLoading] = useState<number | null>(null)
  const [localCompleted, setLocalCompleted] = useState<number[]>(completedKms)
  const router = useRouter()
  const supabase = createClient()

  const toggle = async (taskKm: number) => {
    setLoading(taskKm)
    const isDone = localCompleted.includes(taskKm)

    if (isDone) {
      await supabase
        .from('maintenance_logs')
        .delete()
        .eq('vehicle_id', vehicleId)
        .eq('task_km', taskKm)
      setLocalCompleted(prev => prev.filter(k => k !== taskKm))
    } else {
      await supabase
        .from('maintenance_logs')
        .insert({ vehicle_id: vehicleId, task_km: taskKm })
      setLocalCompleted(prev => [...prev, taskKm])
    }

    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => {
        const done = localCompleted.includes(task.km)
        const isLoading = loading === task.km
        const isDoneVariant = variant === 'done'

        return (
          <div
            key={task.km}
            onClick={() => !isLoading && toggle(task.km)}
            className={`rounded-2xl p-3 border-2 cursor-pointer transition-all ${
              isDoneVariant
                ? 'bg-green-50 border-green-100 hover:border-red-200 hover:bg-red-50'
                : done
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-100 hover:border-gray-300'
            }`}>
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                isDoneVariant || done ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}>
                {isLoading ? (
                  <span className="text-xs">...</span>
                ) : (isDoneVariant || done) ? (
                  <span className="text-white text-xs font-bold">✓</span>
                ) : null}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-semibold text-sm ${
                    isDoneVariant ? 'text-green-700' : done ? 'text-green-700 line-through' : 'text-gray-800'
                  }`}>
                    {task.task}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {task.km.toLocaleString()} km
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{task.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
