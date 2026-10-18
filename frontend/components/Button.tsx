'use client'

import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary-accent' | 'primary-dark' | 'ghost-on-dark'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  trailingIcon?: LucideIcon
  leadingIcon?: LucideIcon
  children: ReactNode
  /** Hero CTA uses 48px height per component spec */
  size?: 'header' | 'hero' | 'search'
}

const variantClasses: Record<Variant, string> = {
  'primary-accent':
    'bg-accent text-on-accent shadow-button hover:bg-accent-hover hover:-translate-y-px',
  'primary-dark':
    'bg-brand-dark text-on-accent hover:bg-brand-dark-hover hover:-translate-y-px',
  'ghost-on-dark':
    'border border-[rgba(255,255,255,0.8)] bg-transparent text-on-dark-primary hover:bg-[rgba(255,255,255,0.15)]',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  header: 'h-10 px-5 text-[15px] font-semibold',
  hero: 'h-12 px-6 text-[15px] font-semibold',
  search: 'h-14 px-7 text-[15px] font-semibold',
}

export function Button({
  variant = 'primary-accent',
  trailingIcon: Trailing,
  leadingIcon: Leading,
  children,
  size = 'header',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-pill transition-colors duration-base ease-ds focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60 motion-reduce:transform-none motion-reduce:hover:transform-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {Leading ? <Leading size={18} strokeWidth={1.5} aria-hidden /> : null}
      {children}
      {Trailing ? <Trailing size={16} strokeWidth={1.5} aria-hidden /> : null}
    </button>
  )
}
