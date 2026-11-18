import { CircleUser, Compass, Info, Map, Utensils } from 'lucide-react';

const ITEMS = [
  { href: '/map', label: 'Map', icon: Map },
  { href: '/venues', label: 'Venues', icon: Compass },
  { href: '/canteens', label: 'Canteens', icon: Utensils },
  { href: '/profile', label: 'Profile', icon: CircleUser },
  { href: '/about', label: 'About', icon: Info },
];

export default function BottomNavigation({ activePath }) {
  return <nav className="bottom-navigation" aria-label="Main navigation">
    {ITEMS.map(({ href, label, icon: Icon }) => <a key={href} href={href} aria-current={activePath === href ? 'page' : undefined}>
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
      <span>{label}</span>
    </a>)}
  </nav>;
}
