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
    <main className="min-h-screen flex flex-col" style={{ background: '#FDF0EB' }}>

      {/* Hero superior — ilustración + color */}
      <div className="flex-shrink-0 relative" style={{ background: '#E8B4A0', paddingTop: '56px', paddingBottom: '40px' }}>
        {/* Pill badge top */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <span className="text-xs font-semibold px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.35)', color: '#5C2A1E' }}>
            Gratis · Sin tarjeta de crédito
          </span>
        </div>

        {/* Auto grande + familia */}
        <div className="text-center">
          <div style={{ fontSize: '88px', lineHeight: 1 }}>🚗</div>
          <div className="flex justify-center gap-1 mt-3">
            {['👩', '👨', '👧', '👦'].map((e, i) => (
              <span key={i} style={{ fontSize: '22px' }}>{e}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Card principal — sube sobre el hero */}
      <div className="flex-1 flex flex-col px-5 -mt-6">
        <div className="bg-white rounded-3xl shadow-lg pt-8 pb-8 px-6 flex flex-col gap-6">

          {/* Promesa */}
          <div>
            <h1 className="text-2xl font-extrabold leading-tight mb-2" style={{ color: '#3D1810' }}>
              Tu familia siempre<br />llega sana
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#A07060' }}>
              AutoFamilia te avisa cuándo revisar tu auto para que nunca te agarre desprevenida en la ruta.
            </p>
          </div>

          {/* Features — 3 bullets visuales */}
          <div className="space-y-3">
            {[
              { icon: '🔔', title: 'Alertas antes de que sea tarde', desc: 'Aceite, correas, frenos — te avisamos antes de cada vencimiento.' },
              { icon: '📋', title: 'Manual de tu auto incluido', desc: 'Datos reales de fábrica para tu modelo y kilometraje.' },
              { icon: '🛡️', title: 'Seguro y VTV en un lugar', desc: 'Nunca más te agarren vencidos en la calle.' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#3D1810' }}>{f.title}</p>
                  <p className="text-xs" style={{ color: '#A07060' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-1">
            <Link
              href="/register"
              className="block w-full text-center py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
              style={{ background: '#C97B5A' }}>
              Empezar gratis
            </Link>
            <Link
              href="/login"
              className="block w-full text-center py-3.5 rounded-2xl font-semibold text-base border-2 transition-all active:scale-95"
              style={{ color: '#C97B5A', borderColor: '#E8B4A0', background: 'transparent' }}>
              Ya tengo cuenta
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-center text-xs" style={{ color: '#C49080' }}>
            +2.400 familias ya cuidan su auto con AutoFamilia
          </p>

        </div>
      </div>

      <div className="py-6" />
    </main>
  )
}
