// ─────────────────────────────────────────────────────────────────────────────
// AUTOFAMILIA — Motor de datos de mantenimiento
// Arquitectura: tareas con intervalo recurrente (interval_km) o hito único (at_km)
// El generador produce instancias km concretas para la UI
// ─────────────────────────────────────────────────────────────────────────────

export type Category =
  | 'fluidos'
  | 'filtros'
  | 'distribucion'
  | 'frenos'
  | 'electrico'
  | 'suspension'
  | 'transmision'
  | 'neumaticos'
  | 'motor'
  | 'inspeccion'

export type Severity = 'routine' | 'important' | 'critical'

export type TaskDef = {
  id: string
  task: string
  description: string
  category: Category
  severity: Severity
  interval_km?: number      // recurrente: cada N km
  first_km?: number         // primer km donde aplica (default = interval_km)
  at_km?: number            // hito único: exactamente a estos km
  interval_months?: number  // también vence por tiempo (lo que llegue primero)
}

// Lo que devuelven las funciones al componente — compatible con UI actual
export type MaintenanceTask = {
  km: number
  task: string
  description: string
  category: Category
  severity: Severity
  taskId: string
}

export type CarModel = {
  id: string
  brand: string
  name: string
  emoji: string
  year_from: number
  year_to: number | null  // null = sigue en producción
  versions: string[]
  engineOptions: string[]
  schedule: TaskDef[]
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERADOR: convierte TaskDef[] en instancias km concretas
// ─────────────────────────────────────────────────────────────────────────────
export function generateSchedule(defs: TaskDef[], upToKm: number): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = []

  for (const def of defs) {
    if (def.at_km !== undefined) {
      // Hito único
      if (def.at_km <= upToKm) {
        tasks.push({ km: def.at_km, task: def.task, description: def.description, category: def.category, severity: def.severity, taskId: def.id })
      }
    } else if (def.interval_km !== undefined) {
      // Recurrente: genera instancias desde first_km hasta upToKm
      const start = def.first_km ?? def.interval_km
      for (let km = start; km <= upToKm; km += def.interval_km) {
        tasks.push({ km, task: def.task, description: def.description, category: def.category, severity: def.severity, taskId: `${def.id}-${km}` })
      }
    }
  }

  return tasks.sort((a, b) => a.km - b.km)
}

// ─────────────────────────────────────────────────────────────────────────────
// DATOS — 20 autos más vendidos en Argentina
// ─────────────────────────────────────────────────────────────────────────────

export const CAR_MODELS: CarModel[] = [

  // ── 1. FORD RANGER ──────────────────────────────────────────────────────────
  {
    id: 'ford-ranger',
    brand: 'Ford',
    name: 'Ranger',
    emoji: '🛻',
    year_from: 2012,
    year_to: null,
    versions: ['XL', 'XLS', 'XLT', 'Limited', 'Storm', 'Raptor'],
    engineOptions: ['2.2 TDCi 160cv', '3.2 TDCi 200cv', '2.0 Bi-Turbo 213cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 diesel (Ford WSS-M2C948-B). El 2.2 y 3.2 TDCi requieren aceite específico diesel. Verificar nivel de AdBlue en 3.2.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 6 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo (aire cabina)', description: 'Reemplazar filtro de polen/habitáculo. Mejora calidad del aire interior.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'fuel-filter', task: 'Filtro de combustible diesel', description: 'Crítico en Argentina por calidad variable del gasoil. Incluye purgar el agua del separador cada 10k.', category: 'filtros', severity: 'important', interval_km: 20000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de aire. En zonas de tierra o polvo, hacerlo cada 15k.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'tires-rotation', task: 'Rotación de neumáticos', description: 'Rotar según patrón Ford (cruz para 4x4). Incluye verificar presión del auxilio.', category: 'neumaticos', severity: 'routine', interval_km: 10000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Verificar pastillas delanteras y traseras, discos y nivel de líquido.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'Líquido DOT 4. Absorbe humedad con el tiempo, reduciendo el punto de ebullición y la eficacia frenante.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'diff-fluid-rear', task: 'Aceite de diferencial trasero', description: 'Aceite SAE 80W-90 GL-5. En versiones 4x4 incluir diferencial delantero y transfer.', category: 'transmision', severity: 'important', interval_km: 60000 },
      { id: 'gearbox-fluid', task: 'Aceite de caja de cambios', description: 'Caja manual: SAE 75W-90. Automática Torqshift 6: Mercon LV. Cambio preventivo.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'glow-plugs', task: 'Verificación de bujías de precalentamiento', description: 'Bujías calentadoras del motor diesel. Si arranque en frío tarda más de lo normal, verificar.', category: 'electrico', severity: 'important', interval_km: 60000 },
      { id: 'accessory-belt', task: 'Correa de accesorios (serpentina)', description: 'Reemplazar correa que mueve alternador, compresor A/C y dirección hidráulica. Preventivo.', category: 'distribucion', severity: 'important', interval_km: 80000 },
      { id: 'timing-chain', task: 'Inspección de cadena de distribución', description: 'La Ranger usa cadena (no correa): más duradera pero no inmortal. Si hay ruido metálico en frío o el aceite no se cambia regularmente, falla antes. Verificar tensores y guías.', category: 'distribucion', severity: 'critical', at_km: 100000 },
      { id: 'timing-chain-2', task: 'Segunda inspección de cadena', description: 'Reevaluar estado de cadena, tensores y guías. Si hay desgaste visible, reemplazar preventivamente.', category: 'distribucion', severity: 'critical', at_km: 180000 },
      { id: 'coolant', task: 'Cambio de líquido refrigerante', description: 'Ford Motorcraft Premium Gold Coolant. Protege contra corrosión y sobrecalentamiento. Incluir revisión de mangueras del turbo.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension-check', task: 'Revisión de suspensión', description: 'Verificar amortiguadores delanteros y traseros de hoja, rótulas, bujes de barra estabilizadora. La carga y el uso off-road aceleran el desgaste.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'injectors', task: 'Limpieza o revisión de inyectores', description: 'Inyectores common rail. Limpiar con aditivo o en banco de pruebas. El gasoil de mala calidad los tapona.', category: 'motor', severity: 'important', at_km: 120000 },
      { id: 'injectors-2', task: 'Segunda revisión de inyectores', description: 'A esta distancia, si hay humo negro o consumo elevado, evaluar recalibración o cambio.', category: 'motor', severity: 'critical', at_km: 220000 },
      { id: 'turbo-check', task: 'Revisión del turbocompresor', description: 'Verificar juego axial y radial del eje del turbo, revisar mangueras del intercooler y retenes de aceite.', category: 'motor', severity: 'critical', at_km: 150000 },
      { id: 'spark-plugs-diesel', task: 'Revisión del sistema de admisión', description: 'Limpiar cuerpo de mariposa, EGR y colector de admisión. Los motores diesel a GNC acumulan carbonilla.', category: 'motor', severity: 'important', interval_km: 80000 },
      { id: 'full-service', task: 'Service mayor completo', description: 'Revisión integral: motor, frenos, suspensión, dirección, electrónica, luces, escapes, retenes. Diagnóstico con escáner.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'transfer-service', task: 'Service de caja de transfer (4x4)', description: 'Aceite de transfer BorgWarner. Solo aplica versiones 4x4. Cambio preventivo.', category: 'transmision', severity: 'important', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Medir tensión en frío y capacidad. A los 3-4 años la batería pierde capacidad. La Ranger tiene mucha electrónica que la demanda.', category: 'electrico', severity: 'important', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 2. TOYOTA HILUX ─────────────────────────────────────────────────────────
  {
    id: 'toyota-hilux',
    brand: 'Toyota',
    name: 'Hilux',
    emoji: '🛻',
    year_from: 2016,
    year_to: null,
    versions: ['DX', 'SR', 'SRV', 'SRX', '4x2', '4x4'],
    engineOptions: ['2.4 GD 150cv', '2.8 GD-6 204cv', '2.7 VVT-i 166cv (nafta)'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite diesel 5W-30 ACEA C3 (GD motor). Motor 2.7 nafta: 5W-30 SM/SN. Toyota recomienda aceite genuino.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 6 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen de la cabina.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'fuel-filter', task: 'Filtro de combustible diesel', description: 'Drenar agua del separador cada 5.000 km o ante la luz de alerta. Cambio completo cada 20k.', category: 'filtros', severity: 'important', interval_km: 20000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar. En caminos de tierra, inspeccionar cada 10k.', category: 'filtros', severity: 'routine', interval_km: 40000, interval_months: 24 },
      { id: 'tire-rotation', task: 'Rotación de neumáticos', description: 'Rotar en cruz. Verificar presión incluyendo auxilio.', category: 'neumaticos', severity: 'routine', interval_km: 10000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas, discos y/o tambores traseros. Nivel y estado del líquido.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 3 o DOT 4 según año. Absorbe humedad: degradado reduce eficacia en pendientes.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'diff-fluid', task: 'Aceite de diferenciales y transfer', description: 'Diferencial trasero API GL-5 SAE 75W-90. En 4x4: diferencial delantero y transfer. Toyota ATF-WS para automáticas.', category: 'transmision', severity: 'important', interval_km: 60000 },
      { id: 'gearbox', task: 'Aceite de caja manual', description: 'SAE 75W-90 GL-4. Cambio preventivo para mantener cambios suaves.', category: 'transmision', severity: 'routine', interval_km: 80000 },
      { id: 'glow-plugs', task: 'Revisión de bujías de precalentamiento', description: 'Motor diesel GD: verificar a esta distancia. Si arranque en frío demora más o hay humo blanco excesivo.', category: 'electrico', severity: 'important', interval_km: 60000 },
      { id: 'accessory-belt', task: 'Correa de accesorios', description: 'Reemplazar correa serpentina con tensores.', category: 'distribucion', severity: 'important', interval_km: 100000 },
      { id: 'timing-chain', task: 'Inspección de cadena de distribución', description: 'La Hilux usa cadena doble. Muy durable pero requiere aceite limpio. Verificar tensores, guías y ruido en frío.', category: 'distribucion', severity: 'critical', at_km: 150000 },
      { id: 'coolant', task: 'Cambio de líquido refrigerante', description: 'Toyota Super Long Life Coolant (rosado). Primera renovación a los 160k km o 10 años. Luego cada 80k o 5 años.', category: 'fluidos', severity: 'important', at_km: 160000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Amortiguadores, rótulas, bujes de barra delantera y trasera. La carga frecuente acelera desgaste trasero.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'injectors', task: 'Limpieza de inyectores', description: 'Common rail Denso. Usar aditivo limpiador o revisión en banco. Previene consumo elevado y humo negro.', category: 'motor', severity: 'important', at_km: 100000 },
      { id: 'egr-clean', task: 'Limpieza de válvula EGR', description: 'La EGR se carbonizia con el tiempo, especialmente con uso urbano. Limpiar o reemplazar a esta distancia.', category: 'motor', severity: 'important', at_km: 80000 },
      { id: 'full-service', task: 'Service mayor completo', description: 'Diagnóstico electrónico, revisión integral de todos los sistemas. La Hilux es durable pero no inmortal.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'atf-auto', task: 'Aceite de caja automática (ATF)', description: 'Toyota ATF-WS. Versiones automáticas: cambio preventivo. Muchos problemas de caja se evitan con este servicio.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'battery', task: 'Verificación de batería', description: 'La Hilux tiene sistema stop/start en versiones nuevas. Requiere batería AGM específica. Medir capacidad.', category: 'electrico', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'urea-adblue', task: 'Rellenar AdBlue (versiones Euro 6)', description: 'Fluido de urea para sistema SCR. Se consume aprox. cada 10.000 km. No confundir con combustible.', category: 'fluidos', severity: 'important', interval_km: 10000 },
    ]
  },

  // ── 3. VOLKSWAGEN AMAROK ────────────────────────────────────────────────────
  {
    id: 'volkswagen-amarok',
    brand: 'Volkswagen',
    name: 'Amarok',
    emoji: '🛻',
    year_from: 2011,
    year_to: null,
    versions: ['Trendline', 'Comfortline', 'Highline', 'Extreme', 'V6 Extreme'],
    engineOptions: ['2.0 TDI 140cv', '2.0 TDI BiTurbo 180cv', '3.0 V6 TDI 258cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite VW 507.00 5W-30 (obligatorio en TDI). Usar solo aceite con especificación VW aprobada. Aceite genérico daña el motor.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'fuel-filter', task: 'Filtro de combustible diesel', description: 'Doble filtro en el V6. Cambio cada 20k km. Crítico por calidad del gasoil en Argentina.', category: 'filtros', severity: 'important', interval_km: 20000 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de aire de cabina.', category: 'filtros', severity: 'routine', interval_km: 20000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor TDI.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas y discos ventilados. El Amarok es pesado: los frenos trabajan más que en autos.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'Liquido DOT 4 especificación VW. Cambio cada 2 años o 40k km.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'dsg-fluid', task: 'Aceite de caja DSG (automática)', description: 'Fluido especial DSG VW G 052 182. Cambio en taller oficial con herramienta VAS. Ignorarlo genera fallas graves.', category: 'transmision', severity: 'critical', interval_km: 80000 },
      { id: 'manual-gearbox', task: 'Aceite de caja manual', description: 'VW G 052 527 75W-90. Solo versiones manuales.', category: 'transmision', severity: 'routine', interval_km: 80000 },
      { id: 'diff-fluid', task: 'Aceite de diferenciales', description: 'Diferencial trasero y 4Motion delantero: aceite especificación VW G 052 145.', category: 'transmision', severity: 'important', interval_km: 60000 },
      { id: 'glow-plugs', task: 'Revisión de bujías de precalentamiento', description: 'Verificar en arranques de invierno. La sustitución incorrecta puede romper el bloque.', category: 'electrico', severity: 'important', interval_km: 80000 },
      { id: 'accessory-belt', task: 'Correa de accesorios y tensores', description: 'Cambio preventivo. El V6 tiene dos correas.', category: 'distribucion', severity: 'important', interval_km: 80000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'El Amarok usa cadena. Requiere aceite correcto y cambios a tiempo. Verificar ruido y tensión.', category: 'distribucion', severity: 'critical', at_km: 100000 },
      { id: 'coolant', task: 'Cambio de refrigerante G13', description: 'Refrigerante VW G13 (violeta). No mezclar con otros colores. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Bujes de triángulo inferior, rótulas, amortiguadores. El peso elevado genera desgaste acelerado.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'injectors', task: 'Revisión de inyectores piezo', description: 'Inyectores Bosch piezo del TDI. Muy sensibles al combustible de mala calidad. Diagnóstico con VCDS.', category: 'motor', severity: 'critical', at_km: 120000 },
      { id: 'full-service', task: 'Service mayor VW', description: 'Inspección con escáner VCDS. Reiniciar contador de service. Verificar software y actualizaciones.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería AGM', description: 'El Amarok con sistema Start/Stop requiere batería AGM. Medir con equipo especial. No reemplazar con batería convencional.', category: 'electrico', severity: 'important', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 4. TOYOTA COROLLA ────────────────────────────────────────────────────────
  {
    id: 'toyota-corolla',
    brand: 'Toyota',
    name: 'Corolla',
    emoji: '🚗',
    year_from: 2019,
    year_to: null,
    versions: ['XLi', 'Gli', 'SEG', 'GR-S', 'Hybrid'],
    engineOptions: ['2.0 Dynamic Force 172cv', '1.8 Dual VVT-i 140cv', '1.8 Híbrido 122cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite Toyota 0W-20 sintético (motor 2.0 y Híbrido). El motor 1.8 acepta 5W-30. Nunca usar aceite de alta viscosidad en estos motores modernos.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo y alérgenos de la cabina.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'tire-rotation', task: 'Rotación de neumáticos', description: 'Rotar en X o directo según tracción. Verificar presión y alineación.', category: 'neumaticos', severity: 'routine', interval_km: 10000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Verificar pastillas, discos y nivel de líquido. El Híbrido usa frenos regenerativos: las pastillas duran mucho más.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 3. En Híbrido, usar fluido específico Toyota. Cambio cada 2 años por absorción de humedad.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías de iridio', description: 'Bujías de iridio Toyota. Duran mucho más que las convencionales pero igualmente hay que reemplazarlas.', category: 'motor', severity: 'important', interval_km: 100000 },
      { id: 'cvt-fluid', task: 'Aceite de CVT', description: 'CVT-FE específico Toyota. La CVT es muy sensible al fluido. Cambio preventivo aunque Toyota no lo requiere oficialmente.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'El Corolla usa cadena. Muy confiable con cambios de aceite al día. Verificar tensores a esta distancia.', category: 'distribucion', severity: 'important', at_km: 120000 },
      { id: 'coolant', task: 'Cambio de refrigerante Toyota SLLC', description: 'Toyota Super Long Life Coolant (rosado). Primer cambio a los 160.000 km o 10 años. Luego cada 80.000 km.', category: 'fluidos', severity: 'important', at_km: 160000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Amortiguadores MacPherson adelante y doble horquilla atrás. Verificar bujes y rótulas.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'hybrid-battery', task: 'Revisión de batería híbrida (Híbrido)', description: 'Solo aplica Corolla Hybrid. Toyota garantiza la batería de alta tensión por 10 años o 240k km en Argentina. Diagnóstico con escáner Toyota para verificar estado de celdas.', category: 'electrico', severity: 'critical', interval_km: 80000 },
      { id: 'full-service', task: 'Service mayor completo', description: 'Diagnóstico Toyota Techstream. Revisión integral. El Corolla es muy confiable pero no descuidarlo.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería convencional', description: 'Medir tensión y capacidad. En el Híbrido, la batería de 12V puede fallar igual.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 5. VOLKSWAGEN POLO ───────────────────────────────────────────────────────
  {
    id: 'volkswagen-polo',
    brand: 'Volkswagen',
    name: 'Polo',
    emoji: '🚗',
    year_from: 2018,
    year_to: null,
    versions: ['Trendline', 'Comfortline', 'Highline', 'GTS'],
    engineOptions: ['1.6 MSI 110cv', '1.0 TSI 95cv', '1.4 TSI 125cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite VW 5W-40 especificación 504/507 (TSI). Motor 1.6 MSI: 5W-30 o 5W-40 VW 502.00. NUNCA usar aceite genérico en VW.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Motor 1.6 MSI: bujías NGK cada 40k. TSI: bujías de iridio cada 60k. El motor turbo es más exigente con las bujías.', category: 'motor', severity: 'important', interval_km: 40000 },
      { id: 'tire-rotation', task: 'Rotación de neumáticos', description: 'Rotar y verificar presión. El Polo tiene tracción delantera: el desgaste frontal es mayor.', category: 'neumaticos', severity: 'routine', interval_km: 10000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas y discos delanteros. Traseros son tambores en versiones básicas.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4 VW. Cambio obligatorio cada 2 años independientemente del kilometraje.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt-1.6', task: 'Correa de distribución (1.6 MSI)', description: 'El Polo 1.6 MSI usa CORREA (no cadena). Cambio obligatorio a los 90.000 km. Incluir kit completo: correa, tensores, rodillos y bomba de agua. Su rotura destruye el motor.', category: 'distribucion', severity: 'critical', interval_km: 90000, first_km: 90000 },
      { id: 'chain-tsi', task: 'Revisión de cadena (TSI)', description: 'El Polo TSI usa cadena. Muy sensible a la calidad del aceite. Si no se cambia el aceite a tiempo, la cadena se estira. Verificar ruido en frío.', category: 'distribucion', severity: 'critical', at_km: 100000 },
      { id: 'dsg-fluid', task: 'Aceite de caja DSG', description: 'Fluido DSG VW (G 052 182). Solo versiones automáticas DSG. Cambio en taller con equipo especial.', category: 'transmision', severity: 'critical', interval_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante G13', description: 'VW G13 violeta. No mezclar con refrigerantes genéricos. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson delante. Verificar bujes de triángulo y barra estabilizadora. El Polo es bajo: vulnerable a baches.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor VW', description: 'Diagnóstico VCDS. Reiniciar indicador de service. El Polo tiene muchos sistemas electrónicos.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Con Start/Stop: batería AGM. Sin Start/Stop: convencional. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 6. PEUGEOT 208 ──────────────────────────────────────────────────────────
  {
    id: 'peugeot-208',
    brand: 'Peugeot',
    name: '208',
    emoji: '🚗',
    year_from: 2020,
    year_to: null,
    versions: ['Like', 'Active', 'Allure', 'GT Line', 'GT'],
    engineOptions: ['1.2 PureTech 82cv', '1.2 PureTech 110cv Turbo', '1.6 THP 165cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 especificación PSA B71 2290 (PureTech) o B71 2312 (turbo). ATENCIÓN: el PureTech 1.2 turbo tiene historial de consumo elevado de aceite. Verificar nivel mensualmente.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'oil-level-check', task: 'Verificación mensual del nivel de aceite', description: 'El PureTech 1.2 turbo es conocido por consumir aceite. Verificar nivel cada 1.000 km en los primeros 60k. Si consume más de 1 litro cada 5k, consultar taller.', category: 'fluidos', severity: 'important', interval_km: 5000 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Bujías NGK o Bosch específicas PureTech. El motor turbo pequeño es muy sensible a bujías desgastadas.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas y discos delanteros. Traseros: tambores o discos según versión.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4 especificación PSA. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución — CRÍTICO', description: 'El 208 PureTech 1.2 turbo usa correa de distribución. Historial documentado de fallas prematuras. Cambio OBLIGATORIO a los 60.000 km (no esperar a los 90k como indica el manual original). Incluir kit completo con bomba de agua y tensores.', category: 'distribucion', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante PSA específico (azul/verde). Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson. El 208 tiene dirección eléctrica sensible. Verificar rótulas y bujes.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'auto-gearbox', task: 'Aceite de caja automática', description: 'ATF Dexron VI en cambio automático de 8 velocidades. Cambio preventivo aunque Peugeot lo llame "vitalicio".', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'full-service', task: 'Service mayor PSA', description: 'Diagnóstico con herramienta PSA. Verificar actualizaciones de software (especialmente en PureTech con historial de problemas).', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería Stop/Start AGM o EFB. Medir capacidad. El consumo eléctrico del 208 moderno es elevado.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 7. RENAULT SANDERO / LOGAN ───────────────────────────────────────────────
  {
    id: 'renault-sandero',
    brand: 'Renault',
    name: 'Sandero / Logan',
    emoji: '🚗',
    year_from: 2012,
    year_to: null,
    versions: ['Authentique', 'Expression', 'Privilege', 'Stepway', 'RS'],
    engineOptions: ['1.0 16V 75cv', '1.6 16V 110cv', '1.0 Turbo 90cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-40 Renault RN0700/RN0710 o 5W-30 según motor. Motor 1.0 Turbo: 0W-20 o 5W-30.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Motor 1.6: bujías de platino cada 40k. Motor 1.0 turbo: bujías de iridio cada 60k.', category: 'motor', severity: 'important', interval_km: 40000 },
      { id: 'brake-check', task: 'Revisión de frenos', description: 'El Sandero/Logan usa TAMBORES traseros. Son económicos pero acumulan polvo. Verificar y limpiar.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años. Los tambores traseros retienen más calor.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución — CRÍTICO', description: 'El Sandero/Logan 1.6 16V usa CORREA. Cambio OBLIGATORIO a los 60.000 km. Falla = motor destruido (motor de interferencia). Kit completo: correa, tensores, rodillo y bomba de agua. NO esperar síntomas.', category: 'distribucion', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Renault orgánico. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Bujes de barra delantera y amortiguadores. El Sandero/Logan tiene suspensión robusta pero los bujes de aluminio se desgastan.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'auto-gearbox', task: 'Aceite de caja CVT o automática', description: 'Versiones X-Tronic CVT: fluido NS-3 Nissan (compartida con Renault). Cambio cada 60k. NUNCA usar ATF genérico.', category: 'transmision', severity: 'critical', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Renault', description: 'Revisión integral. El Sandero es muy accesible para el service pero no descuidar la distribución.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional. Medir tensión y capacidad cada 2 años. Vida útil promedio 4 años en Argentina.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 8. CHEVROLET ONIX ────────────────────────────────────────────────────────
  {
    id: 'chevrolet-onix',
    brand: 'Chevrolet',
    name: 'Onix',
    emoji: '🚗',
    year_from: 2020,
    year_to: null,
    versions: ['Joy', 'LS', 'LT', 'LTZ', 'RS', 'Premier'],
    engineOptions: ['1.0 Turbo 116cv', '1.2 Aspirado 75cv (nuevo)', '1.4 Aspirado 98cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite Dexos1 Gen2 5W-30 (Chevrolet obligatorio). Motor 1.0 Turbo: respetar especificación Dexos. Aceite genérico puede anular garantía.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de habitáculo.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Bujías de iridio Delphi o AC Delco. El 1.0 Turbo es sensible a bujías desgastadas (vibración en ralentí).', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'tire-rotation', task: 'Rotación de neumáticos', description: 'Rotar en X. El Onix desgasta más las delanteras por tracción.', category: 'neumaticos', severity: 'routine', interval_km: 10000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas delanteras y tambores traseros. Tambores: verificar y limpiar.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución (1.0 Turbo)', description: 'El Onix 1.0 Turbo usa cadena. Muy sensible a la calidad y regularidad del cambio de aceite. Si no se cambia a tiempo, la cadena se estira prematuramente.', category: 'distribucion', severity: 'critical', at_km: 80000 },
      { id: 'timing-belt-1.4', task: 'Correa de distribución (1.4)', description: 'El Onix 1.4 usa CORREA. Cambio obligatorio a los 80.000 km. Incluir kit completo.', category: 'distribucion', severity: 'critical', interval_km: 80000, first_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante Dex-Cool', description: 'Dex-Cool naranja (específico GM). No mezclar con refrigerante verde genérico: gelifica y tapa el sistema.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'auto-gearbox', task: 'Aceite de caja automática', description: 'ATF Dexron VI. Versiones automáticas. Cambio preventivo aunque GM lo llame "de por vida".', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Amortiguadores McPherson. Verificar bujes y bieletas estabilizadoras, muy comunes de desgastar.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Chevrolet', description: 'Diagnóstico electrónico. Revisión integral. El Onix es muy popular y tiene buena red de talleres.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional 45Ah. Medir capacidad. El clima caliente de Argentina reduce su vida útil.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 9. FIAT CRONOS ──────────────────────────────────────────────────────────
  {
    id: 'fiat-cronos',
    brand: 'Fiat',
    name: 'Cronos',
    emoji: '🚗',
    year_from: 2018,
    year_to: null,
    versions: ['Like', 'Drive', 'Precision', 'HGT'],
    engineOptions: ['1.3 Firefly 101cv', '1.8 E.torQ 135cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 Selenia K especificación Fiat 9.55535-S1. No usar aceite mineral: el Firefly fue diseñado para sintético.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Bujías de iridio Fiat específicas. Motor Firefly es de alta compresión.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas delanteras y tambores traseros. Verificar estado y limpieza de tambores.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución — CRÍTICO', description: 'El Cronos 1.3 Firefly usa CORREA de distribución. Cambio OBLIGATORIO a los 60.000 km. Motor de interferencia: si la correa se rompe, el motor queda destruido. Incluir kit completo con tensores y bomba de agua.', category: 'distribucion', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: 'timing-belt-1.8', task: 'Correa de distribución 1.8 E.torQ — CRÍTICO', description: 'El motor 1.8 también usa correa. Cambio a los 80.000 km con kit completo.', category: 'distribucion', severity: 'critical', interval_km: 80000, first_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Fiat orgánico. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson delantero. El Cronos tiene buena calidad de suspensión pero verificar bujes y amortiguadores.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'auto-gearbox', task: 'Aceite de caja automática', description: 'Cambio de fluido en versiones automáticas. No postponer.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'full-service', task: 'Service mayor Fiat', description: 'Revisión integral con diagnóstico. La red de Fiat en Argentina es muy amplia.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 10. CHEVROLET TRACKER ────────────────────────────────────────────────────
  {
    id: 'chevrolet-tracker',
    brand: 'Chevrolet',
    name: 'Tracker',
    emoji: '🚙',
    year_from: 2020,
    year_to: null,
    versions: ['LS', 'LT', 'LTZ', 'Premier', 'RS'],
    engineOptions: ['1.0 Turbo 116cv', '1.2 Turbo 133cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite Dexos1 Gen2 0W-20 (1.0 Turbo) o 5W-30. Motor turbo pequeño: muy sensible a la calidad del aceite. El calor del turbo degrada el aceite más rápido.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías de iridio', description: 'Motor 1.0 Turbo: bujías de iridio AC Delco. Sensibles al desgaste por la alta carga del turbo.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Discos y pastillas en las cuatro ruedas. El Tracker es más pesado que un auto: más desgaste.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'El Tracker usa cadena. Muy sensible al cambio de aceite puntual. Si el aceite se degrada, la cadena se estira y genera ruido metálico en frío.', category: 'distribucion', severity: 'critical', at_km: 80000 },
      { id: 'turbo-check', task: 'Revisión del turbocompresor', description: 'El turbo del 1.0 trabaja constantemente. Verificar mangueras del intercooler, juego del eje y retenes. Dejar el motor ralentizar 2 minutos antes de apagar.', category: 'motor', severity: 'important', at_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante Dex-Cool', description: 'Dex-Cool naranja específico GM. No mezclar con refrigerante verde.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'auto-gearbox', task: 'Aceite de caja automática', description: 'ATF Dexron VI. Cambio preventivo en automáticas de 6 velocidades.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson delante, eje trasero torsional. Verificar bujes y amortiguadores.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Chevrolet', description: 'Diagnóstico electrónico GM. Revisión integral incluyendo sistema de turbo.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'El Tracker tiene mucha electrónica de asistencia. Verificar capacidad.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 11. TOYOTA YARIS ────────────────────────────────────────────────────────
  {
    id: 'toyota-yaris',
    brand: 'Toyota',
    name: 'Yaris',
    emoji: '🚗',
    year_from: 2018,
    year_to: null,
    versions: ['XL', 'XLS', 'XLS Connect', 'S', 'GR-S'],
    engineOptions: ['1.5 Dual VVT-i 107cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite Toyota 0W-20 (recomendado) o 5W-30. Motor muy eficiente de ciclo Atkinson. La baja viscosidad es clave para su funcionamiento.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías de iridio', description: 'Bujías de iridio Toyota. Duran 100.000 km pero verificar antes si hay vibración.', category: 'motor', severity: 'important', interval_km: 100000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas delanteras y tambores traseros. El Yaris tiene bajo peso: frenos duran bien.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 3. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'El Yaris usa cadena. Toyota es muy confiable en este aspecto. Verificar tensores y escuchar ruidos en frío.', category: 'distribucion', severity: 'important', at_km: 120000 },
      { id: 'cvt-fluid', task: 'Aceite de CVT', description: 'CVT-FE Toyota. Cambio preventivo aunque Toyota no lo exige. Mejora la suavidad de la transmisión.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante SLLC', description: 'Toyota Super Long Life Coolant rosado. Primer cambio a los 160k o 10 años.', category: 'fluidos', severity: 'important', at_km: 160000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Suspensión muy confiable. Verificar bujes de barra delantera que se desgastan antes.', category: 'suspension', severity: 'routine', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Toyota', description: 'Diagnóstico Toyota Techstream. El Yaris es uno de los autos más confiables del mercado.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional 45Ah. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 12. NISSAN KICKS ────────────────────────────────────────────────────────
  {
    id: 'nissan-kicks',
    brand: 'Nissan',
    name: 'Kicks',
    emoji: '🚙',
    year_from: 2017,
    year_to: null,
    versions: ['Sense', 'Advance', 'Exclusive', 'SR'],
    engineOptions: ['1.6 16V 114cv', '1.0 Turbo 116cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 sintético Nissan. El motor 1.0 Turbo: verificar nivel mensualmente (puede consumir aceite).', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías de iridio', description: 'Bujías de iridio Nissan. Cambio cada 60k o antes si hay vibración en ralentí.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas y discos delanteros. Tambores traseros en versiones básicas.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'cvt-fluid', task: 'Fluido de transmisión CVT — IMPORTANTE', description: 'Fluido NS-3 Nissan específico para CVT. NUNCA usar ATF genérico: destruye la transmisión. Cambio preventivo obligatorio.', category: 'transmision', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'El Kicks usa cadena. Verificar ruido en arranque frío y tensores.', category: 'distribucion', severity: 'important', at_km: 100000 },
      { id: 'coolant', task: 'Cambio de refrigerante Long Life', description: 'Refrigerante Nissan Long Life Coolant. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Torsion beam trasera. Verificar bujes y amortiguadores.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Nissan', description: 'Diagnóstico electrónico. Revisión integral.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 13. TOYOTA COROLLA CROSS ────────────────────────────────────────────────
  {
    id: 'toyota-corolla-cross',
    brand: 'Toyota',
    name: 'Corolla Cross',
    emoji: '🚙',
    year_from: 2021,
    year_to: null,
    versions: ['XLi', 'Gli', 'SEG', 'GR-S'],
    engineOptions: ['2.0 Dynamic Force 172cv', '1.8 Híbrido 122cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Toyota 0W-20 sintético (ambos motores). Motor Dynamic Force y Híbrido requieren aceite de muy baja fricción.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Versión Híbrida: las pastillas duran mucho más por freno regenerativo. Igual verificar.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 3 o DOT 4 según versión. Híbrido: fluido específico Toyota.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías de iridio', description: 'Bujías Toyota de iridio. Duran 100k km.', category: 'motor', severity: 'important', interval_km: 100000 },
      { id: 'hybrid-battery', task: 'Revisión de batería de alta tensión (Híbrido)', description: 'Diagnóstico con Toyota Techstream de las celdas de la batería NiMH. Toyota garantiza 10 años / 240k km en Argentina. Verificar temperatura y capacidad.', category: 'electrico', severity: 'critical', interval_km: 80000 },
      { id: 'cvt-fluid', task: 'Fluido de transmisión CVT', description: 'CVT-FE Toyota. Cambio preventivo cada 80k km.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'Cadena Toyota. Muy confiable. Verificar tensores a esta distancia.', category: 'distribucion', severity: 'important', at_km: 120000 },
      { id: 'coolant', task: 'Cambio de refrigerante SLLC', description: 'Toyota Super Long Life Coolant rosado. Cambio a los 160k o 10 años.', category: 'fluidos', severity: 'important', at_km: 160000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson delante, doble horquilla atrás. El Corolla Cross es más alto: verificar bujes en uso off-road.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Toyota', description: 'Diagnóstico Toyota Techstream con revisión del sistema híbrido.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
    ]
  },

  // ── 14. RENAULT DUSTER / OROCH ───────────────────────────────────────────────
  {
    id: 'renault-duster',
    brand: 'Renault',
    name: 'Duster / Oroch',
    emoji: '🚙',
    year_from: 2018,
    year_to: null,
    versions: ['Authentique', 'Expression', 'Dynamique', 'Iconic', 'Oroch'],
    engineOptions: ['1.6 16V 114cv', '2.0 16V 143cv', '1.3 Turbo 150cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-40 Renault RN0700 (1.6/2.0) o 5W-30 (1.3 Turbo). Motor turbo: verificar nivel mensualmente.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar. En uso off-road o zonas de tierra: cada 15k km.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Bujías de platino (1.6/2.0) o iridio (1.3 Turbo). Cambio cada 40-60k.', category: 'motor', severity: 'important', interval_km: 40000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Tambores traseros en versiones básicas. Discos traseros en versiones 4x4. Verificar desgaste diferencial por uso off-road.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución — CRÍTICO', description: 'El Duster 1.6 y 2.0 usan CORREA de distribución. Cambio a los 60.000 km con kit completo incluyendo bomba de agua y tensores. Motor de interferencia.', category: 'distribucion', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: '4x4-fluids', task: 'Aceite de transfer y diferencial trasero (4x4)', description: 'Solo versiones 4x4. Aceite de transfer y diferencial trasero. El uso off-road exige cambio más frecuente.', category: 'transmision', severity: 'important', interval_km: 40000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Renault orgánico. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'El Duster tiene altura libre elevada. Verificar amortiguadores, bujes y rótulas. El uso off-road los desgasta rápido.', category: 'suspension', severity: 'important', interval_km: 40000 },
      { id: 'full-service', task: 'Service mayor Renault', description: 'Diagnóstico electrónico. Revisión integral incluyendo sistema 4x4.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 15. FIAT STRADA ──────────────────────────────────────────────────────────
  {
    id: 'fiat-strada',
    brand: 'Fiat',
    name: 'Strada',
    emoji: '🛻',
    year_from: 2020,
    year_to: null,
    versions: ['Freedom', 'Endurance', 'Volcano', 'Ultra'],
    engineOptions: ['1.3 Firefly 101cv', '1.4 Fire 86cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 Selenia K especificación Fiat. Motor Firefly: no usar mineral.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/polen.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro. En uso rural con tierra: cada 15k.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Bujías específicas Fiat. La Strada tiene uso mixto que las desgasta.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Revisión de frenos', description: 'La caja de carga genera esfuerzo extra en frenos traseros. Verificar tambores traseros con más frecuencia.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución — CRÍTICO', description: 'La Strada 1.3 Firefly y 1.4 Fire usan CORREA. Cambio a los 60.000 km obligatorio. Motor de interferencia: rotura = motor destruido. Incluir kit completo.', category: 'distribucion', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: 'suspension-rear', task: 'Revisión suspensión trasera', description: 'La caja de carga somete la suspensión trasera a esfuerzos adicionales. Verificar muelles, amortiguadores y bujes traseros con mayor frecuencia.', category: 'suspension', severity: 'important', interval_km: 40000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Fiat orgánico. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'full-service', task: 'Service mayor Fiat', description: 'Revisión integral. La Strada es muy popular en uso rural.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería convencional. Verificar capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 16. MITSUBISHI L200 / TRITON ─────────────────────────────────────────────
  {
    id: 'mitsubishi-l200',
    brand: 'Mitsubishi',
    name: 'L200 / Triton',
    emoji: '🛻',
    year_from: 2015,
    year_to: null,
    versions: ['GL', 'GLS', 'HPE', 'Triton Sport'],
    engineOptions: ['2.4 MIVEC Diesel 181cv', '2.5 DI-D Diesel 136cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite diesel 5W-30 o 5W-40 Mitsubishi Diamond Grade. Motor diesel MIVEC: respetar especificación.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 6 },
      { id: 'fuel-filter', task: 'Filtro de combustible diesel', description: 'Cambio cada 20k. En Argentina drenar separador de agua cada 10k.', category: 'filtros', severity: 'important', interval_km: 20000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar. En uso off-road con polvo: cada 15k.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Verificar pastillas y discos en las cuatro ruedas. Tambores traseros en versiones 2WD básicas.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'diff-fluid', task: 'Aceite de diferenciales y transfer', description: 'Diferencial trasero y delantero (4x4): SAE 75W-90 GL-5. Transfer: MTF. Uso off-road = cambio más frecuente.', category: 'transmision', severity: 'important', interval_km: 40000 },
      { id: 'gearbox', task: 'Aceite de caja manual', description: 'SAE 75W-90. Cambio preventivo.', category: 'transmision', severity: 'routine', interval_km: 80000 },
      { id: 'glow-plugs', task: 'Revisión bujías de precalentamiento', description: 'Motor diesel: verificar bujías calentadoras. Mala partida en frío indica falla.', category: 'electrico', severity: 'important', interval_km: 60000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'La L200 usa cadena. Verificar tensores y guías. Muy importante con uso off-road pesado.', category: 'distribucion', severity: 'critical', at_km: 100000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Doble wishbone delante, hoja trasera. El uso off-road es duro con rótulas y bujes.', category: 'suspension', severity: 'important', interval_km: 40000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Mitsubishi Long Life. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'full-service', task: 'Service mayor Mitsubishi', description: 'Diagnóstico electrónico. Revisión integral incluyendo sistema 4WD.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
    ]
  },

  // ── 17. KIA SPORTAGE ────────────────────────────────────────────────────────
  {
    id: 'kia-sportage',
    brand: 'Kia',
    name: 'Sportage',
    emoji: '🚙',
    year_from: 2016,
    year_to: null,
    versions: ['LX', 'EX', 'SX', 'GT Line', 'Gravity'],
    engineOptions: ['2.0 MPi 150cv', '1.6 T-GDi 177cv', '2.0 CRDi Diesel 136cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 sintético aprobado por Kia. Motor 1.6 T-GDi: muy exigente, verificar nivel mensualmente.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías de iridio', description: 'Motores nafta: bujías de iridio cada 60k.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Discos y pastillas en las cuatro ruedas. El Sportage es pesado: frenos trabajan más.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'auto-gearbox', task: 'Aceite de caja automática', description: 'ATF SP-IV Kia/Hyundai. Cambio preventivo cada 80k. Crítico para la longevidad de la caja.', category: 'transmision', severity: 'important', interval_km: 80000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'El Sportage 2.0 usa cadena. Verificar tensores y escuchar ruido en frío.', category: 'distribucion', severity: 'important', at_km: 100000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Kia Long Life Coolant. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Suspensión independiente en las cuatro ruedas. Verificar bujes y amortiguadores.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Kia', description: 'Diagnóstico electrónico. Revisión integral. La garantía de 5 años de Kia requiere servicios en red oficial.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería AGM en versiones con Start/Stop. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 18. NISSAN FRONTIER / NAVARA ─────────────────────────────────────────────
  {
    id: 'nissan-frontier',
    brand: 'Nissan',
    name: 'Frontier',
    emoji: '🛻',
    year_from: 2017,
    year_to: null,
    versions: ['S', 'SV', 'SL', 'Pro-4X'],
    engineOptions: ['2.3 Bi-Turbo Diesel 190cv', '2.5 Diesel 170cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 diesel sintético Nissan. Motor bi-turbo: muy importante el aceite de calidad.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 6 },
      { id: 'fuel-filter', task: 'Filtro de combustible diesel', description: 'Cambio cada 20k. Drenar separador de agua cada 10k. El bi-turbo es sensible al combustible sucio.', category: 'filtros', severity: 'important', interval_km: 20000 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar. En off-road o zonas de polvo: cada 15k.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas y discos en las cuatro ruedas. El peso de la Frontier demanda frenos en buen estado.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'diff-fluid', task: 'Aceite de diferenciales y transfer', description: 'Diferencial trasero: SAE 80W-90 GL-5. 4x4: delantero y transfer también. Cambio preventivo.', category: 'transmision', severity: 'important', interval_km: 60000 },
      { id: 'gearbox', task: 'Aceite de caja de cambios', description: 'Manual: 75W-90. Automática: ATF NS-3 Nissan.', category: 'transmision', severity: 'routine', interval_km: 80000 },
      { id: 'glow-plugs', task: 'Revisión de bujías de precalentamiento', description: 'Motor diesel: verificar bujías calentadoras. El bi-turbo en frío necesita precalentamiento correcto.', category: 'electrico', severity: 'important', interval_km: 60000 },
      { id: 'timing-chain', task: 'Revisión de cadena de distribución', description: 'La Frontier usa cadena. Verificar tensores y ruido. La cadena del YD25 tiene historial de problemas si no se cambia aceite a tiempo.', category: 'distribucion', severity: 'critical', at_km: 80000 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'Doble wishbone delante, hoja trasera. El off-road desgasta rótulas y bujes delanteros.', category: 'suspension', severity: 'important', interval_km: 40000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Nissan Long Life. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'full-service', task: 'Service mayor Nissan', description: 'Diagnóstico electrónico. Revisión integral de motor bi-turbo y sistema 4x4.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
    ]
  },

  // ── 19. JEEP RENEGADE ────────────────────────────────────────────────────────
  {
    id: 'jeep-renegade',
    brand: 'Jeep',
    name: 'Renegade',
    emoji: '🚙',
    year_from: 2015,
    year_to: null,
    versions: ['Sport', 'Longitude', 'Limited', 'Trailhawk', '80 Aniversario'],
    engineOptions: ['1.3 Turbo T4 150cv', '1.8 16V E.torQ 139cv', '2.0 Turbo Diesel 170cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite 5W-40 Mopar (1.8 E.torQ) o 0W-30 (1.3 Turbo T4). El motor turbo es exigente con la calidad del aceite.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Motor 1.8: bujías de iridio cada 60k. Motor 1.3 Turbo: específicas Stellantis.', category: 'motor', severity: 'important', interval_km: 60000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas y discos en las cuatro ruedas. El Renegade es un SUV con peso elevado.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4 Mopar. Cambio cada 2 años.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución (1.8 E.torQ)', description: 'El motor 1.8 usa CORREA. Cambio obligatorio a los 60.000 km con kit completo. Motor de interferencia.', category: 'distribucion', severity: 'critical', interval_km: 60000, first_km: 60000 },
      { id: 'timing-chain-turbo', task: 'Revisión de cadena (1.3 Turbo T4)', description: 'El motor 1.3 Turbo usa cadena. Muy sensible a la calidad del aceite. Verificar ruido en frío a esta distancia.', category: 'distribucion', severity: 'critical', at_km: 80000 },
      { id: 'auto-gearbox', task: 'Aceite de caja automática DDCT/ZF', description: 'Caja DDCT de doble embrague o ZF 9 velocidades. Fluido específico Mopar. Cambio preventivo.', category: 'transmision', severity: 'critical', interval_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante', description: 'Refrigerante Mopar orgánico. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson delante, multibrazo atrás. El Trailhawk con uso off-road desgasta más rápido.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor Jeep', description: 'Diagnóstico con herramienta Stellantis. Revisión integral.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'El Renegade tiene mucha electrónica: sistema Uconnect, asistencias de manejo. Batería demandada.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },

  // ── 20. VOLKSWAGEN VIRTUS ────────────────────────────────────────────────────
  {
    id: 'volkswagen-virtus',
    brand: 'Volkswagen',
    name: 'Virtus',
    emoji: '🚗',
    year_from: 2018,
    year_to: null,
    versions: ['Trendline', 'Comfortline', 'Highline', 'GTS'],
    engineOptions: ['1.6 MSI 110cv', '1.0 TSI 95cv'],
    schedule: [
      { id: 'oil', task: 'Cambio de aceite y filtro', description: 'Aceite VW 5W-40 especificación 502/505.00 (1.6 MSI) o 504/507 (TSI). Solo aceite aprobado por VW.', category: 'fluidos', severity: 'routine', interval_km: 10000, interval_months: 12 },
      { id: 'cabin-filter', task: 'Filtro de habitáculo', description: 'Reemplazar filtro de polvo/alérgenos.', category: 'filtros', severity: 'routine', interval_km: 15000, interval_months: 12 },
      { id: 'air-filter', task: 'Filtro de aire del motor', description: 'Reemplazar filtro de motor.', category: 'filtros', severity: 'routine', interval_km: 30000, interval_months: 24 },
      { id: 'spark-plugs', task: 'Bujías', description: 'Motor 1.6 MSI: bujías NGK cada 40k. Motor TSI: bujías de iridio cada 60k.', category: 'motor', severity: 'important', interval_km: 40000 },
      { id: 'brake-check', task: 'Inspección de frenos', description: 'Pastillas delanteras y tambores traseros. Verificar estado.', category: 'frenos', severity: 'routine', interval_km: 20000 },
      { id: 'brake-fluid', task: 'Cambio de líquido de frenos', description: 'DOT 4 VW. Cambio cada 2 años independientemente del km.', category: 'frenos', severity: 'important', interval_km: 40000, interval_months: 24 },
      { id: 'timing-belt', task: 'Correa de distribución (1.6 MSI)', description: 'El Virtus 1.6 MSI usa CORREA. Cambio a los 90.000 km con kit completo. Motor de interferencia: su rotura destruye el motor.', category: 'distribucion', severity: 'critical', interval_km: 90000, first_km: 90000 },
      { id: 'timing-chain-tsi', task: 'Revisión de cadena (TSI)', description: 'El 1.0 TSI usa cadena. Muy sensible al aceite VW correcto y cambios puntuales.', category: 'distribucion', severity: 'critical', at_km: 100000 },
      { id: 'dsg-fluid', task: 'Aceite de caja DSG', description: 'Fluido DSG VW G052182. Solo versiones DSG. Cambio en taller oficial con equipo VAS.', category: 'transmision', severity: 'critical', interval_km: 80000 },
      { id: 'coolant', task: 'Cambio de refrigerante G13', description: 'VW G13 violeta. Cambio cada 100k o 5 años.', category: 'fluidos', severity: 'important', interval_km: 100000, first_km: 100000, interval_months: 60 },
      { id: 'suspension', task: 'Revisión de suspensión', description: 'McPherson. Verificar bujes de triángulo y barra estabilizadora.', category: 'suspension', severity: 'important', interval_km: 60000 },
      { id: 'full-service', task: 'Service mayor VW', description: 'Diagnóstico VCDS. Reiniciar indicador de service. Verificar actualizaciones de software.', category: 'inspeccion', severity: 'critical', interval_km: 100000, first_km: 100000 },
      { id: 'battery', task: 'Verificación de batería', description: 'Batería AGM (Start/Stop) o convencional. Medir capacidad cada 2 años.', category: 'electrico', severity: 'routine', interval_km: 40000, interval_months: 24 },
    ]
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES PÚBLICAS — compatibles con la UI existente
// ─────────────────────────────────────────────────────────────────────────────

export function getCarById(id: string): CarModel | undefined {
  return CAR_MODELS.find(car => car.id === id)
}

export function getMaintenanceUpToKm(carId: string, currentKm: number): MaintenanceTask[] {
  const car = getCarById(carId)
  if (!car) return []
  return generateSchedule(car.schedule, currentKm)
}

export function getUpcomingMaintenance(carId: string, currentKm: number, rangeKm = 5000): MaintenanceTask[] {
  const car = getCarById(carId)
  if (!car) return []
  // Genera hasta currentKm + rangeKm y filtra lo que no llegó aún
  const allUpToFuture = generateSchedule(car.schedule, currentKm + rangeKm)
  return allUpToFuture.filter(t => t.km > currentKm)
}
