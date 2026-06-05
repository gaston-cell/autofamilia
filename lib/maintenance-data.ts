export type MaintenanceTask = {
  km: number
  task: string
  description: string
  severity: 'routine' | 'important' | 'critical'
}

export type CarModel = {
  id: string
  brand: string
  name: string
  versions: string[]
  engineOptions: string[]
  schedule: MaintenanceTask[]
}

export const CAR_MODELS: CarModel[] = [
  {
    id: 'toyota-hilux',
    brand: 'Toyota',
    name: 'Hilux',
    versions: ['DX', 'SR', 'SRV', 'SRX', '4x2', '4x4'],
    engineOptions: ['2.4 GD', '2.8 GD-6', '2.7 VVT-i'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite sintético 5W-30. Protege el motor en todo clima.', severity: 'routine' },
      { km: 20000, task: 'Filtro de aire y cabina', description: 'Reemplazar filtro de motor y filtro de aire de cabina (polen).', severity: 'routine' },
      { km: 30000, task: 'Filtro de combustible (Diesel)', description: 'Crítico en Latinoamérica por la calidad variable del gasoil.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos y diferenciales', description: 'Cambio de líquido de frenos DOT 4. Revisión de aceite de diferenciales en versiones 4x4.', severity: 'important' },
      { km: 50000, task: 'Revisión de suspensión', description: 'Verificar amortiguadores, rótulas y bujes. Importante para estabilidad familiar.', severity: 'important' },
      { km: 60000, task: 'Revisión de bujías de precalentamiento', description: 'En motores diesel, verificar bujías de precalentamiento para arranques confiables.', severity: 'important' },
      { km: 80000, task: 'Aceite de caja y diferencial', description: 'Cambio de aceite de transmisión manual o automática según versión.', severity: 'important' },
      { km: 100000, task: 'Service mayor — Inspección completa', description: 'Revisión de cadena de distribución, bomba de agua, tensores, correa de accesorios.', severity: 'critical' },
      { km: 120000, task: 'Correa de accesorios', description: 'Cambio preventivo de correa que mueve alternador y aire acondicionado.', severity: 'critical' },
      { km: 150000, task: 'Líquido refrigerante', description: 'Cambio de refrigerante Long Life. Previene sobrecalentamiento en viajes largos.', severity: 'critical' },
      { km: 160000, task: 'Aceite de caja automática (ATF)', description: 'En versiones automáticas, cambio de fluido de transmisión.', severity: 'important' },
      { km: 200000, task: 'Revisión de inyectores', description: 'Limpieza o revisión de inyectores para mantener eficiencia de combustible.', severity: 'important' },
      { km: 240000, task: 'Renovación completa de fluidos', description: 'Repetir ciclo de todos los fluidos: diferenciales, frenos, refrigerante.', severity: 'critical' },
    ]
  },
  {
    id: 'fiat-cronos',
    brand: 'Fiat',
    name: 'Cronos',
    versions: ['Like', 'Drive', 'Precision', 'HGT'],
    engineOptions: ['1.3 Firefly', '1.8 E.torQ'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30. Verificar nivel de líquidos.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros para proteger el motor y el interior.', severity: 'routine' },
      { km: 30000, task: 'Revisión de frenos', description: 'Verificar pastillas y discos delanteros. Los traseros suelen durar más.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos', description: 'Cambio obligatorio de líquido de frenos DOT 4.', severity: 'important' },
      { km: 60000, task: 'Correa de distribución — CRÍTICO', description: 'El Cronos 1.3 usa correa, no cadena. Su rotura puede destruir el motor. No postergar.', severity: 'critical' },
      { km: 80000, task: 'Bujías y cables de encendido', description: 'Reemplazar bujías de iridio y verificar cables.', severity: 'important' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de suspensión, dirección y sistema de frenos.', severity: 'critical' },
      { km: 120000, task: 'Segunda correa de distribución', description: 'Cambio de correa nuevamente. Crítico para la vida del motor.', severity: 'critical' },
      { km: 150000, task: 'Líquido refrigerante', description: 'Cambio de líquido refrigerante. Verificar mangueras y termostato.', severity: 'important' },
      { km: 180000, task: 'Tercera correa de distribución', description: 'Cambio de correa. Incluir tensores y rodamientos.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda de motor', description: 'Medir compresión, verificar sellos y retenes.', severity: 'critical' },
      { km: 240000, task: 'Cuarta correa de distribución', description: 'Cambio de correa con kit completo de distribución.', severity: 'critical' },
    ]
  },
  {
    id: 'volkswagen-polo',
    brand: 'Volkswagen',
    name: 'Polo',
    versions: ['Trendline', 'Comfortline', 'Highline', 'GTS'],
    engineOptions: ['1.6 MSI', '1.0 TSI', '1.4 TSI'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite VW 5W-40 especificación 504/507. Usar solo aceite aprobado por VW.', severity: 'routine' },
      { km: 20000, task: 'Filtro de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías', description: 'Reemplazar bujías de iridio. En TSI son más delicadas.', severity: 'important' },
      { km: 60000, task: 'Líquido de frenos y revisión', description: 'Cambio de líquido de frenos. Revisión completa del sistema.', severity: 'important' },
      { km: 90000, task: 'Correa de distribución', description: 'El Polo 1.6 MSI usa correa. Cambio obligatorio con kit completo.', severity: 'critical' },
      { km: 100000, task: 'Service mayor', description: 'Revisión de suspensión, bujes de parrilla y amortiguadores.', severity: 'critical' },
      { km: 120000, task: 'Aceite de caja automática', description: 'En versiones DSG o automática, cambio de fluido de transmisión.', severity: 'important' },
      { km: 150000, task: 'Líquido refrigerante', description: 'Cambio de refrigerante G13 (color violeta) específico de VW.', severity: 'important' },
      { km: 180000, task: 'Segunda correa de distribución', description: 'Segundo cambio de correa con tensores y bomba de agua.', severity: 'critical' },
      { km: 200000, task: 'Revisión mayor de motor', description: 'Verificar culata, juntas y sellos. Compresión de cilindros.', severity: 'critical' },
    ]
  },
  {
    id: 'chevrolet-onix',
    brand: 'Chevrolet',
    name: 'Onix',
    versions: ['Joy', 'LS', 'LT', 'LTZ', 'RS', 'Premier'],
    engineOptions: ['1.0 Turbo', '1.2', '1.4'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite Dexos1 Gen2 5W-30. Especificación Chevrolet obligatoria.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar filtro de motor y filtro de habitáculo.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Cambio de bujías de iridio y líquido de frenos DOT 4.', severity: 'important' },
      { km: 60000, task: 'Revisión de correa de accesorios', description: 'Verificar estado de correa de alternador y aire acondicionado.', severity: 'important' },
      { km: 80000, task: 'Correa de distribución', description: 'El Onix 1.4 usa correa. Cambio con kit completo. Crítico.', severity: 'critical' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa: suspensión, frenos, dirección, motor.', severity: 'critical' },
      { km: 120000, task: 'Refrigerante y termostato', description: 'Cambio de líquido refrigerante Dex-Cool específico de GM.', severity: 'important' },
      { km: 150000, task: 'Revisión de transmisión', description: 'Verificar caja automática o manual según versión.', severity: 'important' },
      { km: 160000, task: 'Segunda correa de distribución', description: 'Cambio de correa con tensores y rodillo guía.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda de motor', description: 'Medir compresión, verificar consumo de aceite.', severity: 'critical' },
    ]
  },
  {
    id: 'ford-ranger',
    brand: 'Ford',
    name: 'Ranger',
    versions: ['XL', 'XLS', 'XLT', 'Limited', 'Storm', 'Raptor'],
    engineOptions: ['2.2 TDCi', '3.2 TDCi', '2.0 Bi-Turbo'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite diesel 5W-30 o 5W-40 según motor. Verificar nivel de AdBlue en versiones Euro 6.', severity: 'routine' },
      { km: 20000, task: 'Filtro de combustible y aire', description: 'Cambio de filtro diesel y filtro de aire. Crítico por calidad del gasoil en Latam.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos y revisión 4x4', description: 'Cambio de líquido de frenos. En versiones 4x4, verificar aceite de diferenciales.', severity: 'important' },
      { km: 60000, task: 'Bujías de precalentamiento', description: 'En motores diesel, verificar bujías de precalentamiento para arranques confiables.', severity: 'important' },
      { km: 80000, task: 'Aceite de caja y diferencial', description: 'Cambio de aceite de transmisión y diferencial trasero (y delantero en 4x4).', severity: 'important' },
      { km: 100000, task: 'Revisión de cadena de distribución', description: 'La Ranger usa cadena, no correa. Verificar tensores y guías. Cambio si hay ruidos.', severity: 'critical' },
      { km: 120000, task: 'Correa de accesorios', description: 'Cambio preventivo de correa serpentina.', severity: 'important' },
      { km: 150000, task: 'Líquido refrigerante', description: 'Cambio de refrigerante Ford Motorcraft. Verificar mangueras del turbo.', severity: 'important' },
      { km: 200000, task: 'Revisión mayor de motor', description: 'Limpieza de inyectores, verificar turbo, medir compresión.', severity: 'critical' },
      { km: 240000, task: 'Renovación de fluidos completa', description: 'Todos los fluidos: diferencial, caja, frenos, refrigerante.', severity: 'critical' },
    ]
  },
  {
    id: 'nissan-versa',
    brand: 'Nissan',
    name: 'Versa',
    versions: ['Sense', 'Advance', 'Exclusive', 'SR'],
    engineOptions: ['1.6 16V', '1.8 16V'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 sintético. Verificar nivel de todos los fluidos.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de platino o iridio. Cambio de líquido de frenos.', severity: 'important' },
      { km: 60000, task: 'Revisión de suspensión', description: 'Verificar amortiguadores, bieletas y bujes.', severity: 'important' },
      { km: 100000, task: 'Cadena de distribución', description: 'El Versa 1.6 usa cadena. Verificar tensores y ruido en frío.', severity: 'critical' },
      { km: 120000, task: 'Refrigerante y termostato', description: 'Cambio de refrigerante Nissan Long Life.', severity: 'important' },
      { km: 150000, task: 'Service mayor', description: 'Revisión completa de motor y tren motriz.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda', description: 'Medir compresión, verificar sellos de válvulas.', severity: 'critical' },
    ]
  },
  {
    id: 'hyundai-hb20',
    brand: 'Hyundai',
    name: 'HB20',
    versions: ['Sense', 'Vision', 'Comfort', 'Sport', 'Evolution'],
    engineOptions: ['1.0 Turbo', '1.6 16V'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 full sintético. Hyundai recomienda servicio cada 10,000 km.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar filtro de motor y de habitáculo.', severity: 'routine' },
      { km: 40000, task: 'Líquido de frenos', description: 'Cambio de líquido de frenos DOT 4. Revisión de pastillas.', severity: 'important' },
      { km: 60000, task: 'Bujías', description: 'Reemplazar bujías de iridio.', severity: 'important' },
      { km: 90000, task: 'Correa de distribución', description: 'El HB20 1.6 usa correa. Cambio obligatorio con kit completo.', severity: 'critical' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de suspensión, frenos y motor.', severity: 'critical' },
      { km: 150000, task: 'Refrigerante', description: 'Cambio de líquido refrigerante Hyundai Long Life.', severity: 'important' },
      { km: 180000, task: 'Segunda correa de distribución', description: 'Cambio con tensores y rodillo.', severity: 'critical' },
    ]
  },
  {
    id: 'toyota-yaris',
    brand: 'Toyota',
    name: 'Yaris',
    versions: ['XL', 'XLS', 'XLS Connect', 'S', 'GR-S'],
    engineOptions: ['1.5 Dual VVT-i'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite Toyota 0W-20 o 5W-30. Motor muy eficiente, requiere aceite de baja viscosidad.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de iridio Toyota. Cambio de líquido de frenos.', severity: 'important' },
      { km: 60000, task: 'Revisión de suspensión', description: 'Verificar amortiguadores y bujes.', severity: 'important' },
      { km: 100000, task: 'Cadena de distribución', description: 'El Yaris usa cadena. Toyota recomienda revisión aunque raramente necesita cambio.', severity: 'important' },
      { km: 120000, task: 'Refrigerante', description: 'Cambio de refrigerante Toyota Super Long Life Coolant.', severity: 'important' },
      { km: 150000, task: 'Service mayor', description: 'Revisión completa de motor, frenos y tren delantero.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda', description: 'Motor generalmente muy confiable a esta distancia. Verificar consumo de aceite.', severity: 'important' },
    ]
  },
  {
    id: 'renault-sandero',
    brand: 'Renault',
    name: 'Sandero',
    versions: ['Authentique', 'Expression', 'Privilege', 'Stepway', 'RS'],
    engineOptions: ['1.0 16V', '1.6 16V', '1.0 Turbo'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-40 o según especificación Renault del manual.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 30000, task: 'Revisión de frenos', description: 'Verificar pastillas traseras tipo tambor. El Sandero usa tambores traseros que acumulan polvo.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos y bujías', description: 'Cambio de líquido y bujías de platino.', severity: 'important' },
      { km: 60000, task: 'Correa de distribución — CRÍTICO', description: 'El Sandero 1.6 usa correa. Rotura = motor destruido. No postergar nunca.', severity: 'critical' },
      { km: 80000, task: 'Revisión de suspensión', description: 'Amortiguadores, bieletas y bujes delantera y trasera.', severity: 'important' },
      { km: 120000, task: 'Segunda correa de distribución', description: 'Cambio obligatorio con kit completo.', severity: 'critical' },
      { km: 150000, task: 'Refrigerante', description: 'Cambio de refrigerante Renault.', severity: 'important' },
      { km: 180000, task: 'Tercera correa de distribución', description: 'Tercer cambio. Incluir bomba de agua.', severity: 'critical' },
    ]
  },
  {
    id: 'volkswagen-amarok',
    brand: 'Volkswagen',
    name: 'Amarok',
    versions: ['Trendline', 'Comfortline', 'Highline', 'Extreme', 'V6'],
    engineOptions: ['2.0 TDI 140cv', '2.0 TDI 180cv', '3.0 V6 TDI 258cv'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite VW 507.00 5W-30. Solo usar aceite aprobado por VW para motores TDI.', severity: 'routine' },
      { km: 20000, task: 'Filtros de combustible y aire', description: 'Cambio de filtro diesel (doble en el V6) y filtro de aire.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos y diferenciales', description: 'Cambio de frenos y aceite de diferencial trasero (y delantero en 4Motion).', severity: 'important' },
      { km: 60000, task: 'Bujías de precalentamiento', description: 'Verificar bujías calentadoras del motor diesel.', severity: 'important' },
      { km: 80000, task: 'Aceite de caja DSG', description: 'Cambio de aceite de caja automática DSG. Procedimiento específico VW.', severity: 'critical' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de cadena de distribución, turbo, intercooler y sistema de inyección.', severity: 'critical' },
      { km: 120000, task: 'Correa de accesorios y tensores', description: 'Cambio preventivo de correa y todos los tensores.', severity: 'important' },
      { km: 150000, task: 'Refrigerante G13', description: 'Cambio de refrigerante específico VW G13 (violeta).', severity: 'important' },
      { km: 200000, task: 'Revisión de inyectores y turbo', description: 'Limpieza de inyectores. Verificar turbo por desgaste en retenes.', severity: 'critical' },
    ]
  },
  {
    id: 'chevrolet-tracker',
    brand: 'Chevrolet',
    name: 'Tracker',
    versions: ['LS', 'LT', 'LTZ', 'Premier', 'RS'],
    engineOptions: ['1.0 Turbo', '1.2 Turbo'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite Dexos1 Gen2 0W-20 específico para motor turbo de baja cilindrada.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros. El 1.0 Turbo es sensible a la calidad del aire.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de iridio. Cambio de líquido de frenos DOT 4.', severity: 'important' },
      { km: 60000, task: 'Revisión de correa de accesorios', description: 'Verificar estado de correa y tensores del motor turbo.', severity: 'important' },
      { km: 80000, task: 'Revisión de turbo y cadena', description: 'El Tracker usa cadena de distribución. Verificar tensores y nivel de aceite del turbo.', severity: 'critical' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de suspensión, frenos, dirección y tren motriz.', severity: 'critical' },
      { km: 120000, task: 'Refrigerante Dex-Cool', description: 'Cambio de refrigerante específico GM Dex-Cool (naranja).', severity: 'important' },
      { km: 150000, task: 'Revisión profunda de turbo', description: 'Verificar presión de turbo, retenes y mangueras de intercooler.', severity: 'critical' },
      { km: 200000, task: 'Revisión mayor de motor', description: 'Medir compresión, verificar consumo de aceite en motor turbo.', severity: 'critical' },
    ]
  },
  {
    id: 'toyota-corolla',
    brand: 'Toyota',
    name: 'Corolla',
    versions: ['XLi', 'Gli', 'SEG', 'GR-S', 'Hybrid'],
    engineOptions: ['1.8 Dual VVT-i', '2.0 Dynamic Force', '1.8 Híbrido'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite Toyota 0W-20 sintético. El Corolla moderno usa aceite de muy baja viscosidad.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de iridio Toyota. Cambio de líquido de frenos DOT 3.', severity: 'important' },
      { km: 60000, task: 'Revisión de suspensión', description: 'Verificar amortiguadores, rótulas y bujes delanteros.', severity: 'important' },
      { km: 100000, task: 'Cadena de distribución', description: 'El Corolla usa cadena. Toyota recomienda inspección visual aunque raramente falla antes de 200k.', severity: 'important' },
      { km: 120000, task: 'Refrigerante Super Long Life', description: 'Cambio de refrigerante Toyota SLLC rosado. Primer cambio a los 160k, luego cada 80k.', severity: 'important' },
      { km: 150000, task: 'Service mayor', description: 'Revisión completa. El Corolla es muy confiable pero necesita atención a esta distancia.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda de motor', description: 'Verificar consumo de aceite, sellos de válvulas y compresión.', severity: 'important' },
      { km: 240000, task: 'Renovación de fluidos', description: 'Cambio completo de todos los fluidos del vehículo.', severity: 'critical' },
    ]
  },
  {
    id: 'nissan-kicks',
    brand: 'Nissan',
    name: 'Kicks',
    versions: ['Sense', 'Advance', 'Exclusive', 'SR'],
    engineOptions: ['1.6 16V', '1.0 Turbo'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 sintético Nissan. Verificar nivel de fluido de CVT.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Fluido de CVT — IMPORTANTE', description: 'El Kicks CVT requiere cambio de fluido específico NS-3. No usar aceites genéricos.', severity: 'critical' },
      { km: 60000, task: 'Bujías y líquido de frenos', description: 'Bujías de iridio. Cambio de líquido de frenos DOT 4.', severity: 'important' },
      { km: 80000, task: 'Revisión de cadena de distribución', description: 'Verificar tensores y ruido en frío. El Kicks usa cadena.', severity: 'important' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa incluyendo segunda renovación del fluido CVT.', severity: 'critical' },
      { km: 120000, task: 'Refrigerante Long Life', description: 'Cambio de refrigerante Nissan Long Life Coolant.', severity: 'important' },
      { km: 160000, task: 'Tercer cambio de fluido CVT', description: 'Crítico para la longevidad de la transmisión. No postergar.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda de motor y CVT', description: 'Evaluación completa del estado mecánico.', severity: 'critical' },
    ]
  },
  {
    id: 'peugeot-208',
    brand: 'Peugeot',
    name: '208',
    versions: ['Like', 'Active', 'Allure', 'GT', 'GT Line'],
    engineOptions: ['1.2 PureTech 82cv', '1.2 PureTech 110cv', '1.6 THP'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 especificación PSA B71 2290. Solo usar aceite aprobado por Peugeot.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías NGK o Bosch específicas. Cambio de líquido de frenos DOT 4.', severity: 'important' },
      { km: 60000, task: 'Correa de distribución — CRÍTICO', description: 'El 208 1.2 PureTech tiene historial de fallas en la correa. Cambio obligatorio y preventivo.', severity: 'critical' },
      { km: 80000, task: 'Revisión de suspensión', description: 'Verificar amortiguadores y bujes. El 208 tiene suspensión deportiva sensible al desgaste.', severity: 'important' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de motor, frenos y tren delantero.', severity: 'critical' },
      { km: 120000, task: 'Segunda correa de distribución', description: 'Segundo cambio obligatorio con kit completo y bomba de agua.', severity: 'critical' },
      { km: 150000, task: 'Refrigerante', description: 'Cambio de refrigerante específico Peugeot (azul/verde).', severity: 'important' },
      { km: 180000, task: 'Tercera correa de distribución', description: 'Tercer cambio. Fundamental para la supervivencia del motor.', severity: 'critical' },
    ]
  },
  {
    id: 'mitsubishi-l200',
    brand: 'Mitsubishi',
    name: 'L200',
    versions: ['GL', 'GLS', 'HPE', 'Triton Sport', 'Savana'],
    engineOptions: ['2.4 MIVEC Diesel', '2.5 Diesel'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite diesel 5W-30 o 5W-40. Verificar nivel de AdBlue en versiones con filtro de partículas.', severity: 'routine' },
      { km: 20000, task: 'Filtro de combustible y aire', description: 'Cambio de filtro diesel y filtro de aire. Crítico por calidad del gasoil.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos y diferenciales', description: 'Cambio de líquido de frenos. En versiones 4x4, verificar aceite de diferenciales.', severity: 'important' },
      { km: 60000, task: 'Bujías de precalentamiento', description: 'Verificar bujías calentadoras del motor diesel para arranques confiables.', severity: 'important' },
      { km: 80000, task: 'Aceite de caja y diferencial', description: 'Cambio de aceite de transmisión manual y diferencial trasero.', severity: 'important' },
      { km: 100000, task: 'Cadena de distribución', description: 'La L200 usa cadena. Verificar tensores y guías. Cambio si hay ruido en frío.', severity: 'critical' },
      { km: 120000, task: 'Correa de accesorios', description: 'Cambio preventivo de correa serpentina con tensores.', severity: 'important' },
      { km: 150000, task: 'Refrigerante', description: 'Cambio de refrigerante Mitsubishi Long Life.', severity: 'important' },
      { km: 200000, task: 'Revisión mayor de motor', description: 'Limpieza de inyectores, verificar turbo y sistema de inyección common rail.', severity: 'critical' },
      { km: 240000, task: 'Renovación completa de fluidos', description: 'Todos los fluidos: diferencial, caja, frenos, refrigerante.', severity: 'critical' },
    ]
  },
  {
    id: 'kia-sportage',
    brand: 'Kia',
    name: 'Sportage',
    versions: ['LX', 'EX', 'SX', 'GT Line', 'Gravity'],
    engineOptions: ['2.0 MPi', '1.6 T-GDi', '2.0 CRDi Diesel'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 sintético. Kia recomienda aceite aprobado por sus especificaciones.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de iridio. Cambio de líquido de frenos.', severity: 'important' },
      { km: 60000, task: 'Revisión de cadena', description: 'El Sportage 2.0 usa cadena de distribución. Verificar tensores.', severity: 'important' },
      { km: 80000, task: 'Aceite de caja automática', description: 'Cambio de fluido de transmisión automática. Kia recomienda cada 80k km.', severity: 'important' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de motor, suspensión y sistema de frenos.', severity: 'critical' },
      { km: 120000, task: 'Refrigerante', description: 'Cambio de refrigerante Kia Long Life Coolant.', severity: 'important' },
      { km: 150000, task: 'Revisión de suspensión', description: 'Amortiguadores, bujes y rótulas. El Sportage tiene suspensión independiente en las cuatro ruedas.', severity: 'important' },
      { km: 200000, task: 'Revisión profunda de motor', description: 'Medir compresión, verificar consumo de aceite y estado general.', severity: 'critical' },
    ]
  },
  {
    id: 'toyota-corolla-cross',
    brand: 'Toyota',
    name: 'Corolla Cross',
    versions: ['XLi', 'Gli', 'SEG', 'GR-S'],
    engineOptions: ['2.0 Dynamic Force', '1.8 Híbrido'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite Toyota 0W-20. El motor Dynamic Force es muy eficiente y requiere aceite de baja viscosidad.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de iridio Toyota. Cambio de líquido de frenos.', severity: 'important' },
      { km: 60000, task: 'Revisión de suspensión', description: 'Verificar amortiguadores y bujes. El Corolla Cross tiene suspensión trasera multibrazo.', severity: 'important' },
      { km: 80000, task: 'Batería de alto voltaje (Híbrido)', description: 'En versiones híbridas: verificar estado de batería de alta tensión y sistema de regeneración.', severity: 'critical' },
      { km: 100000, task: 'Cadena de distribución', description: 'Verificar tensores y estado de la cadena. Toyota usa cadena en todos sus motores modernos.', severity: 'important' },
      { km: 120000, task: 'Refrigerante Super Long Life', description: 'Cambio de refrigerante rosado Toyota SLLC.', severity: 'important' },
      { km: 160000, task: 'Service mayor', description: 'Revisión completa de todos los sistemas incluyendo el híbrido.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda', description: 'Estado general del motor, transmisión y sistema híbrido.', severity: 'critical' },
    ]
  },
  {
    id: 'renault-duster',
    brand: 'Renault',
    name: 'Duster',
    versions: ['Authentique', 'Expression', 'Privilege', 'Dynamique', 'Iconic'],
    engineOptions: ['1.6 16V', '2.0 16V', '1.3 Turbo'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-40 o 5W-30 según motor. Verificar nivel de fluidos.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 40000, task: 'Bujías y líquido de frenos', description: 'Bujías de platino. Cambio de líquido de frenos DOT 4.', severity: 'important' },
      { km: 60000, task: 'Correa de distribución — CRÍTICO', description: 'El Duster 1.6 y 2.0 usan correa. Cambio obligatorio con kit completo.', severity: 'critical' },
      { km: 80000, task: 'Revisión de tracción 4x4', description: 'En versiones 4x4: verificar aceite de transfer y diferenciales.', severity: 'important' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de suspensión, frenos y motor.', severity: 'critical' },
      { km: 120000, task: 'Segunda correa de distribución', description: 'Segundo cambio obligatorio con tensores y bomba de agua.', severity: 'critical' },
      { km: 150000, task: 'Refrigerante', description: 'Cambio de refrigerante Renault.', severity: 'important' },
      { km: 180000, task: 'Tercera correa de distribución', description: 'Tercer cambio con kit completo.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda de motor', description: 'Medir compresión y verificar consumo de aceite.', severity: 'critical' },
    ]
  },
  {
    id: 'fiat-strada',
    brand: 'Fiat',
    name: 'Strada',
    versions: ['Freedom', 'Endurance', 'Volcano', 'Ultra'],
    engineOptions: ['1.3 Firefly', '1.4 Fire', '1.7 Turbo Diesel'],
    schedule: [
      { km: 10000, task: 'Cambio de aceite y filtro', description: 'Aceite 5W-30 sintético. La Strada es muy popular y tiene red de service amplia.', severity: 'routine' },
      { km: 20000, task: 'Filtros de aire y cabina', description: 'Reemplazar ambos filtros.', severity: 'routine' },
      { km: 30000, task: 'Revisión de frenos', description: 'Verificar pastillas y discos. Uso mixto ciudad/carga desgasta más los frenos.', severity: 'important' },
      { km: 40000, task: 'Líquido de frenos y bujías', description: 'Cambio de líquido y bujías de platino.', severity: 'important' },
      { km: 60000, task: 'Correa de distribución — CRÍTICO', description: 'La Strada 1.3 y 1.4 usan correa. Cambio obligatorio. Falla = motor destruido.', severity: 'critical' },
      { km: 80000, task: 'Revisión de suspensión trasera', description: 'La caja de carga genera esfuerzos extra. Verificar muelles y amortiguadores traseros.', severity: 'important' },
      { km: 100000, task: 'Service mayor', description: 'Revisión completa de motor, frenos y suspensión.', severity: 'critical' },
      { km: 120000, task: 'Segunda correa de distribución', description: 'Cambio obligatorio con kit completo.', severity: 'critical' },
      { km: 150000, task: 'Refrigerante', description: 'Cambio de líquido refrigerante y revisión de mangueras.', severity: 'important' },
      { km: 180000, task: 'Tercera correa de distribución', description: 'Tercer cambio con tensores y bomba de agua.', severity: 'critical' },
      { km: 200000, task: 'Revisión profunda de motor', description: 'Medir compresión, verificar sellos y consumo de aceite.', severity: 'critical' },
    ]
  },
]

export function getCarById(id: string): CarModel | undefined {
  return CAR_MODELS.find(car => car.id === id)
}

export function getMaintenanceUpToKm(carId: string, currentKm: number): MaintenanceTask[] {
  const car = getCarById(carId)
  if (!car) return []
  return car.schedule.filter(task => task.km <= currentKm)
}

export function getUpcomingMaintenance(carId: string, currentKm: number, rangeKm = 2000): MaintenanceTask[] {
  const car = getCarById(carId)
  if (!car) return []
  return car.schedule.filter(task => task.km > currentKm && task.km <= currentKm + rangeKm)
}
