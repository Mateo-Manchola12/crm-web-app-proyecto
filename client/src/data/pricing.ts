type TierName = 'starter' | 'pro' | 'enterprise'

export type Tier = {
    name: string
    price: number
    description: string
    features: string[]
    recommended?: boolean
}

type Feature = {
    feature: string
    tiers: Partial<Record<TierName, string>>
}

export const tiers: Record<TierName, Tier> = {
    starter: {
        name: 'Starter',
        price: 19,
        description: 'Comienza a fluir con tu gestión de clientes.',
        features: [
            'Gestión básica de contactos',
            'Historial de interacciones por cliente',
            'Recordatorios y tareas simples',
            'Hasta 3 usuarios activos',
            'Soporte por email en 48h',
        ],
    },
    pro: {
        name: 'Pro',
        price: 49,
        recommended: true,
        description: 'Haz fluir tus procesos y escala tu negocio.',
        features: [
            'Automatización de tareas clave',
            'Embudo de ventas personalizable',
            'Reportes y analíticas en tiempo real',
            'Integración con Google Calendar y Zapier',
            'Hasta 10 usuarios activos',
        ],
    },
    enterprise: {
        name: 'Enterprise',
        price: 99,
        description: 'Fluye sin límites. Todo el poder de VioletFlow.',
        features: [
            'Workflows automatizados y avanzados',
            'Soporte prioritario 24/7',
            'Usuarios ilimitados y permisos granulares',
            'Dashboard personalizable por equipo',
            'Integraciones avanzadas + API abierta',
        ],
    },
}

const features: Feature[] = [
    {
        feature: 'Usuarios activos',
        tiers: { starter: '3', pro: '10', enterprise: 'Ilimitados' },
    },
    {
        feature: 'Gestión de clientes',
        tiers: {
            starter: 'Contactos + historial de notas',
            pro: 'Contactos + actividades + segmentación',
            enterprise: 'Todo + integraciones con sistemas externos',
        },
    },
    {
        feature: 'Automatización de procesos',
        tiers: {
            starter: 'No disponible',
            pro: 'Tareas y correos automáticos',
            enterprise: 'Workflows condicionales y eventos personalizados',
        },
    },
    {
        feature: 'Embudo de ventas',
        tiers: {
            starter: 'Estándar no editable',
            pro: 'Editable por etapas y prioridades',
            enterprise: 'Embudo por equipo, editable y segmentable',
        },
    },
    {
        feature: 'Reportes y estadísticas',
        tiers: {
            starter: 'Reporte mensual básico',
            pro: 'Reportes por cliente, venta y canal',
            enterprise: 'Reportes dinámicos + exportación CSV',
        },
    },
    {
        feature: 'Integraciones',
        tiers: {
            starter: 'Google Calendar (lectura)',
            pro: 'Google Calendar + Zapier',
            enterprise: 'Todo + Webhooks + API REST',
        },
    },
    {
        feature: 'Soporte técnico',
        tiers: {
            starter: 'Email (respuesta en 48h)',
            pro: 'Chat en horario laboral',
            enterprise: 'Soporte prioritario 24/7',
        },
    },
    {
        feature: 'Personalización del panel',
        tiers: {
            starter: 'No disponible',
            pro: 'Cambio de colores y logos',
            enterprise: 'Personalización completa + módulos',
        },
    },
    {
        feature: 'Seguridad y permisos',
        tiers: {
            starter: 'Roles básicos',
            pro: 'Roles avanzados y restricciones por módulo',
            enterprise: 'Control granular por equipo y usuario',
        },
    },
    {
        feature: 'Precio',
        tiers: {
            starter: '$19/mes',
            pro: '$49/mes',
            enterprise: '$99/mes',
        },
    },
]
