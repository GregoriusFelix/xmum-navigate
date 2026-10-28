import { Building2, Compass, House, Map, Utensils } from 'lucide-react';

const ITEMS = [
  { href: '/', label: 'Home', icon: House },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/offices', label: 'Offices', icon: Building2 },
  { href: '/venues', label: 'Venues', icon: Compass },
  { href: '/canteens', label: 'Canteens', icon: Utensils },
];

export default function BottomNavigation({ activePath }) {
  return <nav className="bottom-navigation" aria-label="Main navigation">
    {ITEMS.map(({ href, label, icon: Icon }) => <a key={href} href={href} aria-current={activePath === href ? 'page' : undefined}>
      <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
      <span>{label}</span>
    </a>)}
  </nav>;
}
