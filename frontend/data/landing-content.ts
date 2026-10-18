import type { LucideIcon } from 'lucide-react'
import { BookOpen, Building2, Coffee, GraduationCap, Users } from 'lucide-react'

export type NavLink = { label: string; href: string }

export type SearchField = {
  id: string
  label: string
  placeholder: string
  icon: LucideIcon
}

export type LogoStripItem = {
  id: string
  name: string
  tagline: string
  icon: LucideIcon
}

export type CarouselCard = {
  id: string
  title: string
  subtitle: string
  /** TODO: Replace with XMUM photography */
  imageSrc: string
  imageAlt: string
}

export type LandingContent = {
  brand: {
    name: string
    wordmark: string
  }
  /** TODO: Replace with campus aerial / landscape photo */
  pageBackgroundSrc: string
  pageBackgroundAlt: string
  /** TODO: Replace with XMUM hero photography */
  heroImageSrc: string
  heroImageAlt: string
  navLinks: NavLink[]
  headerGhostCta: string
  headerAccentCta: string
  hero: {
    headlineLine1: string
    headlineLine2: string
    subtext: string
    ctaLabel: string
  }
  search: {
    submitLabel: string
    fields: SearchField[]
  }
  logoStrip: LogoStripItem[]
  featured: {
    heading: string
    subtext: string
    cards: CarouselCard[]
  }
  footer: {
    wordmark: string
    tagline: string
    scriptLines: string[]
    badgeText: string
  }
}

export const landingContent: LandingContent = {
  brand: {
    name: 'XMUM Navigate',
    wordmark: 'XMUM NAVIGATE',
  },
  pageBackgroundSrc:
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
  pageBackgroundAlt: 'Campus greenery and buildings at golden hour',
  heroImageSrc:
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt: 'University campus walkway with trees',
  navLinks: [
    { label: 'Navigate', href: '#navigate' },
    { label: 'Venues', href: '#venues' },
    { label: 'Canteens', href: '#canteens' },
    { label: 'About', href: '#about' },
  ],
  headerGhostCta: 'In development',
  headerAccentCta: 'Explore',
  hero: {
    headlineLine1: 'Find your way',
    headlineLine2: 'around XMUM, from day one.',
    subtext:
      'For new students, parents, and first-time visitors—one calm starting point before you cross campus.',
    ctaLabel: 'See what’s planned',
  },
  search: {
    submitLabel: 'Search',
    fields: [
      {
        id: 'building',
        label: 'Building',
        placeholder: 'Choose a building',
        icon: Building2,
      },
      {
        id: 'floor',
        label: 'Floor',
        placeholder: 'Select floor',
        icon: GraduationCap,
      },
      {
        id: 'destination',
        label: 'Destination',
        placeholder: 'Office or room',
        icon: Users,
      },
    ],
  },
  logoStrip: [
    { id: '1', name: 'Library', tagline: 'Study spaces', icon: BookOpen },
    { id: '2', name: 'Student affairs', tagline: 'Services', icon: Users },
    { id: '3', name: 'Computing', tagline: 'SoCDS', icon: GraduationCap },
    { id: '4', name: 'Canteens', tagline: 'Food courts', icon: Coffee },
    { id: '5', name: 'Venues', tagline: 'Events', icon: Building2 },
  ],
  featured: {
    heading: 'Places to know first',
    subtext: 'Start with buildings and spaces newcomers ask about most.',
    cards: [
      {
        id: 'library',
        title: 'Library, Main',
        subtitle: 'Quiet study & resources',
        imageSrc:
          'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Library interior with bookshelves',
      },
      {
        id: 'lecture',
        title: 'Lecture halls',
        subtitle: 'Classes & orientation',
        imageSrc:
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Lecture hall seating',
      },
      {
        id: 'canteen',
        title: 'Canteen row',
        subtitle: 'Stalls & hours',
        imageSrc:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Campus dining area',
      },
      {
        id: 'admin',
        title: 'Admin block',
        subtitle: 'Offices & help desk',
        imageSrc:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Office building lobby',
      },
    ],
  },
  footer: {
    wordmark: 'XMUM NAVIGATE',
    tagline: 'Final Year Project · School of Computing and Data Science',
    scriptLines: ['Find', 'your', 'path'],
    badgeText: 'XMUM · NAVIGATE · CAMPUS · GUIDE · ',
  },
}
