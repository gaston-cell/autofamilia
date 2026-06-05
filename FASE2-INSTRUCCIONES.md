# Instrucciones para activar la Fase 2 (Notificaciones)

## Lo que hay que hacer mañana (5 minutos)

### 1. Crear cuenta en Resend (email gratuito)
- Entrar a resend.com
- Crear cuenta gratis
- Ir a API Keys → Create API Key
- Copiar la key

### 2. Agregar la key al proyecto
En el archivo `.env.local` agregar:
```
RESEND_API_KEY=re_xxxxxxxxxx
```

### 3. Instalar Resend
En la terminal de VS Code:
```
npm install resend
```

### 4. Avisarle a Claude
Con eso listo, Claude puede escribir:
- La API route que envía los emails
- El cron job que corre una vez por mes
- Las notificaciones de vencimiento de seguro
- Las alertas de mantenimiento por km

## Estado actual
- Templates de email: ✅ Listos (lib/email-templates.ts)
- 20 autos con datos hasta 250k km: ✅ Listos
- Base de datos: ✅ Lista
- Seguro, neumáticos, lavados, desperfectos, perfil: ✅ Listos
