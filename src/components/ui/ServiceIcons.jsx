import dynamic from 'next/dynamic'

export const iconMap = {
  Wrench: dynamic(() => import('lucide-react').then((m) => m.Wrench)),
  Zap: dynamic(() => import('lucide-react').then((m) => m.Zap)),
  Hammer: dynamic(() => import('lucide-react').then((m) => m.Hammer)),
  Thermometer: dynamic(() => import('lucide-react').then((m) => m.Thermometer)),
  Paintbrush: dynamic(() => import('lucide-react').then((m) => m.Paintbrush)),
  SprayCan: dynamic(() => import('lucide-react').then((m) => m.SprayCan)),
  Flower2: dynamic(() => import('lucide-react').then((m) => m.Flower2)),
  Settings: dynamic(() => import('lucide-react').then((m) => m.Settings)),
}

export default function ServiceIcons({ name, size = 24, className = '' }) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
