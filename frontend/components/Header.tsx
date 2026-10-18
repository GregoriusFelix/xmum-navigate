'use client'

import { Map, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { NavLink } from '@/data/landing-content'
import { Button } from './Button'

type HeaderProps = {
  wordmark: string
  navLinks: NavLink[]
  ghostCta: string
  accentCta: string
}

export function Header({ wordmark, navLinks, ghostCta, accentCta }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute left-0 right-0 top-0 z-50 h-[72px] px-8">
      <div className="mx-auto flex h-full max-w-panel items-center justify-between gap-6">
        <a
          href="#top"
          className="flex items-center gap-3 text-on-dark-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
        >
          <Map size={34} strokeWidth={1.5} aria-hidden className="shrink-0" />
          <span className="text-[20px] font-medium uppercase tracking-[0.2em]">{wordmark}</span>
        </a>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-on-dark-primary transition-opacity duration-base ease-ds hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost-on-dark" size="header">
            {ghostCta}
          </Button>
          <Button variant="primary-accent" size="header">
            {accentCta}
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="primary-accent" size="header" className="!px-4">
            {accentCta}
          </Button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-pill text-on-dark-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="mx-3 mt-2 rounded-hero border border-[rgba(255,255,255,0.7)] bg-[rgba(14,52,44,0.92)] p-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-pill px-4 py-3 text-sm font-medium text-on-dark-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button variant="ghost-on-dark" size="header" className="w-full">
                {ghostCta}
              </Button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
